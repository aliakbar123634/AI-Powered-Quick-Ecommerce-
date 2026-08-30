from ast import Is
import logging
from django.shortcuts import render
from accounts.utils import distance
import inventory
from inventory.utils import warehouse
from . models import Cart , CartItem , Order , OrderItem , Payment
from . serializers import CartSerializer , CartItemSerializer  , AddToCartSerializer , OrderItemSerializers , OrderSerializer , PaymentSerializer
from rest_framework.decorators import action, permission_classes
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from products.models import Product
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from accounts.models import Address, RiderProfile
from decimal import Decimal
from accounts.utils.distance import calculate_distance
from inventory.utils.warehouse import get_nearest_warehouse
from inventory.models import Inventory
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from notifications.models import Notification
from rest_framework.decorators import api_view
from notifications.utils import send_email_notification
from delivery.models import DeliveryTracking
from accounts.serializers import RiderOrderSerializer

# Create your views here.

@extend_schema(
    description="Cart operations"
    
)
class CartViewSet(viewsets.ModelViewSet):
    queryset=Cart.objects.all()
    serializer_class=CartSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user) 
    @action(detail=False, methods=['post'], url_path='add')
    def add_item(self, request):

        serializer = AddToCartSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

        product_id = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
            {"message": "Product does not exist"},
            status=status.HTTP_404_NOT_FOUND
        )

        cart, created = Cart.objects.get_or_create(
        user=request.user
    )

        cart_item, item_created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": quantity}
    )

        if not item_created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(
        {"message": "Added to cart successfully"},
        status=status.HTTP_200_OK
    )
    
    @action(detail=False ,  methods=['patch'], url_path='update')
    def update_items(self , request , pk=None):
        serializer = AddToCartSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

        product_id = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        try:
            cart=Cart.objects.get(
                user=request.user
            )
            cart_item = CartItem.objects.get(
            cart=cart,
            product_id=product_id
        )
         
        except Cart.DoesNotExist()  :
            return Response(
            {"message": "Cart not found"},
            status=status.HTTP_404_NOT_FOUND
        )  
        except CartItem.DoesNotExist:
            return Response(
            {"message": "Product not found in cart"},
            status=status.HTTP_404_NOT_FOUND
        )
        cart_item.quantity = quantity
        cart_item.save()
        return Response(
        {
            "message": "Cart updated successfully",
            "product": product_id,
            "quantity": quantity
        },
        status=status.HTTP_200_OK
    )
    @action(detail=False, methods=['delete'], url_path='remove')
    def remove_item(self , request):
        product_id=request.data.get("product")
        try :
            cart = Cart.objects.get(user=request.user)

            cart_item = CartItem.objects.get(
            cart=cart,
            product_id=product_id
        )
        except  Cart.DoesNotExist:
  
            return Response(
            {"message": "Cart not found"},
            status=status.HTTP_404_NOT_FOUND
        )

        except CartItem.DoesNotExist:
             return Response(
            {"message": "Product not found in cart"},
            status=status.HTTP_404_NOT_FOUND
        )  
        cart_item.delete()
        return Response(
        {
            "message": "Item removed successfully"
        },
        status=status.HTTP_200_OK
    )                   
        
@extend_schema(
    description="Cart Item operations"
    
)
class CartItemViewSet(viewsets.ModelViewSet):
    queryset=CartItem.objects.all()  
    serializer_class=CartItemSerializer
    permission_classes = [IsAuthenticated]   

@extend_schema(
    description="Order operations"
    
)
  
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        admin_actions = [
        "assign_rider",
        "admin_start_delivery",
        "admin_delivered",
        "admin_cancel_order",
    ]

        if self.action in admin_actions:
            return [IsAdminUser()]

        return [IsAuthenticated()]

    def get_queryset(self):

        if self.request.user.is_staff or self.request.user.is_superuser:
            return Order.objects.all().select_related(
            "user",
            "rider",
            "Warehouse",
            "address"
        )

        return Order.objects.filter(
        user=self.request.user
    ).select_related(
        "rider",
        "Warehouse",
        "address"
    )

    @action(detail=False, methods=['post'], url_path='create')
    def create_order(self, request):


        user = request.user

        address_id = request.data.get("address")


        try:

            cart = Cart.objects.get(
                user=user
            )

        except Cart.DoesNotExist:

            return Response(
                {"error": "Cart not found"},
                status=status.HTTP_404_NOT_FOUND
            )



        if not cart.items.exists():

            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )



        try:

            address = Address.objects.get(
                id=address_id,
                user=user
            )

        except Address.DoesNotExist:

            return Response(
                {"error": "Invalid address"},
                status=status.HTTP_404_NOT_FOUND
            )
        warehouse=get_nearest_warehouse(address.latitude , address.longitude)
        if not warehouse:
           return Response({"error":"No warehouse available near you"
        }, status=400)

        distance = calculate_distance(
           warehouse.latitude,
           warehouse.longitude,
           address.latitude,
           address.longitude
        )
        # Reserve stock + create the order in ONE transaction.
        # select_for_update() prevents two customers from buying the same stock simultaneously.
        with transaction.atomic():

            locked_inventory = {}

            for item in cart.items.all():
                try:
                    inventory = Inventory.objects.select_for_update().get(
                        warehouse=warehouse,
                        product=item.product
                    )
                except Inventory.DoesNotExist:
                    return Response(
                        {
                            "error":
                            f"{item.product.name} not available in your area"
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if inventory.quantity < item.quantity:
                    return Response(
                        {
                            "error":
                            f"Only {inventory.quantity} {item.product.name} available"
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                locked_inventory[item.product_id] = inventory


            order = Order.objects.create(

                user=user,

                address=address,
                Warehouse=warehouse,
                status="CONFIRMED",


                # address snapshot

                delivery_address=address.formatted_address,

                delivery_city=address.city,

                delivery_state=address.state,

                delivery_country=address.country,

                delivery_postal_code=address.postal_code,

                delivery_latitude=address.latitude,

                delivery_longitude=address.longitude,


                total_price=0,

                delivery_fee=0,

                discount=0,

                subtotal=0

            )



            subtotal = Decimal("0")


            # distance based delivery

            if distance <= 3:

                delivery_fee = Decimal("100")

            elif distance <= 7:

                delivery_fee = Decimal("200")

            else:

                delivery_fee = Decimal("300")



            for item in cart.items.all():


                product_price = (

                    item.product.discount_price

                    if item.product.discount_price is not None

                    else item.product.price

                )


                OrderItem.objects.create(

                    order=order,

                    product=item.product,

                    quantity=item.quantity,

                    price=product_price

                )
 
                inventory = locked_inventory[item.product_id]
                inventory.quantity -= item.quantity


                inventory.save()             

                subtotal += product_price * item.quantity



            discount = subtotal * Decimal("0")


            total_price = (

                subtotal

                -

                discount

                +

                delivery_fee

            )



            order.subtotal = subtotal

            order.discount = discount

            order.delivery_fee = delivery_fee

            order.total_price = total_price
            order.save()
            cart.items.all().delete()
            Notification.objects.create(
                user=user,
                title="Order Placed Successfully",
                message=(
                    f"Your order {order.order_number} "
                    "has been placed successfully."
                )
            )    
            send_email_notification(
                user.email,
                "Order Placed Successfully",
                f"""
                Hello,
                Your order has been placed.
                Order Number:
                {order.order_number}
                Total Amount:
                {order.total_price}
                Thank you for shopping.
                """
                )    


        serializer = OrderSerializer(order)


        return Response(

            serializer.data,

            status=status.HTTP_201_CREATED

        )    
    @action(detail=True, methods=['patch'], url_path='cancel')
    def cancel_order(self , request , pk=None):
        try:
            order_of_id=Order.objects.get(id=pk , user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            ) 

        if order_of_id.status == "CANCELLED":
            return Response(
        {"error": "Order already cancelled"},
        status=status.HTTP_400_BAD_REQUEST
       )
        with transaction.atomic():

            for item in order_of_id.items.all():

                inventory = Inventory.objects.select_for_update().get(
                    warehouse=order_of_id.Warehouse,
                    product=item.product
                )
                inventory.quantity += item.quantity
                inventory.save(update_fields=["quantity"])


            order_of_id.status = "CANCELLED"
            order_of_id.save()
        return Response({
            "message":"order cancelled successfully......"
        }, status=status.HTTP_200_OK)

    @action(
    detail=True,
    methods=["patch"],
    url_path="admin-cancel"
)
    def admin_cancel_order(self, request, pk=None):
 
        try:
            order = Order.objects.get(id=pk)

        except Order.DoesNotExist:
            return Response(
            {"error": "Order not found"},
            status=status.HTTP_404_NOT_FOUND
        )

        if order.status in ["CANCELLED", "DELIVERED"]:
            return Response(
            {"error": "This order cannot be cancelled"},
            status=status.HTTP_400_BAD_REQUEST
        )

        with transaction.atomic():

        # Return stock to the warehouse
            for item in order.items.all():

                inventory = Inventory.objects.select_for_update().get(
                warehouse=order.Warehouse,
                product=item.product
            )

                inventory.quantity += item.quantity
                inventory.save(update_fields=["quantity"])

        # Make rider available again
            if order.rider:
                rider = order.rider
                rider.availability_status = True
                rider.save(update_fields=["availability_status"])

        # Cancel order
            order.status = "CANCELLED"
            order.save(update_fields=["status"])

        return Response(
        {
            "message": "Order cancelled successfully"
        },
        status=status.HTTP_200_OK
    )
    
    @action(
    detail=True,
    methods=["patch"],
    url_path="assign-rider"
)
    def assign_rider(self, request, pk=None):

        try:
            order = Order.objects.get(
            id=pk
        )

        except Order.DoesNotExist:

            return Response(
            {
                "error": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # payment check

        if order.status != "CONFIRMED":
            return Response(
            {
                "error":
                "Payment is not completed yet"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        rider_id = request.data.get(
            "rider"
        )
        if not rider_id:
            return Response(
                {"error": "Rider id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            rider = RiderProfile.objects.get(
            id=rider_id
        )
        except RiderProfile.DoesNotExist:
            return Response(
            {
                "error":
                "Rider not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )
        if not rider.user.is_active:
            return Response(
            {"error": "Rider account is inactive"},
            status=status.HTTP_400_BAD_REQUEST
        )
        if not rider.availability_status:
            return Response(
            {
                "error":
                "Rider is not available"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        if order.rider_id and order.rider_id != rider.id:
            return Response(
                {"error": "A rider is already assigned to this order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.rider = rider
        order.save(update_fields=["rider"])

        rider.availability_status = False
        rider.save(update_fields=["availability_status"])

        # Keep delivery tracking status in sync with rider assignment.
        delivery, created = DeliveryTracking.objects.get_or_create(
            order=order
        )

        delivery.status = DeliveryTracking.Status.ASSIGNED
        delivery.save(update_fields=["status"])
        serializer = OrderSerializer(order)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
   


    @action(detail=True , methods=["patch"] , url_path="start-delivery")
    def start_delivery(self, request, pk=None):
        try:
            order=Order.objects.get(id=pk , rider__user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error":"Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        if order.status != "CONFIRMED":
            return Response(
                {"error":"Order is not in confirmed state"},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = "OUT_FOR_DELIVERY"
        order.save(update_fields=["status"])

        DeliveryTracking.objects.get_or_create(
            order=order,
            defaults={"status": DeliveryTracking.Status.PENDING}
        )

        return Response(
            {
            "message":
            "Delivery started successfully"
            },
           status=status.HTTP_200_OK
    )
    @action(
    detail=True,
    methods=["patch"],
    url_path="delivered"
    )
    def delivered(self, request, pk=None):

        try:
            order = Order.objects.get(
            id=pk,
            rider__user=request.user
        )
        except Order.DoesNotExist:
            return Response(
            {
                "error": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )
        if order.status != "OUT_FOR_DELIVERY":
            return Response(
            {
                "error":
                "Order is not out for delivery"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # update order status

        order.status = "DELIVERED"

        order.save()



    # COD payment complete

        if hasattr(order, "payment"):

            payment = order.payment


            if payment.payment_method == "COD":

                payment.payment_status = "PAID"

                payment.save()



    # rider available again

        rider = order.rider

        rider.availability_status = True

        rider.save()



        return Response(
        {
            "message":
            "Order delivered successfully"
        },
        status=status.HTTP_200_OK
    )

    @action(
    detail=False,
    methods=["get"],
    url_path="my-orders"
)
    def my_orders(self, request):

        try:
            rider = request.user.rider_profile

        except RiderProfile.DoesNotExist:

             return Response(
            {
                "error":
                "You are not a rider"
            },
            status=status.HTTP_403_FORBIDDEN
        )

        orders = Order.objects.filter(
        rider=rider
    ).select_related(
        "user",
        "rider",
        "Warehouse"
    )

        serializer = RiderOrderSerializer(
        orders,
        many=True
    )

        return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@extend_schema(
    description="Order item operations"
    
)
class OrderItemsViewSet(viewsets.ModelViewSet):
    queryset=OrderItem.objects.all()  
    serializer_class=OrderItemSerializers
    permission_classes = [IsAuthenticated]         


#           python manage.py runserver




class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class=PaymentSerializer
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
        return Payment.objects.filter(
            order__user=self.request.user
        )
    @action(detail=False , methods=['post'] , url_path='create-payment')
    def create_payment(self, request):

        order_id = request.data.get("order_id")
        payment_method = request.data.get("payment_method")

        try:
            order = Order.objects.get(
            id=order_id,
            user=request.user
        )

        except Order.DoesNotExist:

            return Response(
            {
                "error":
                "Order does not exist at this order id"
            },
            status=status.HTTP_404_NOT_FOUND
        )


        try:

            payment = Payment.objects.get(
            order=order
        )


        except Payment.DoesNotExist:

            if not payment_method:
                return Response(
                    {"error": "payment_method is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            payment = Payment.objects.create(
                order=order,
                amount=order.total_price,
                payment_method=payment_method,
                payment_status=Payment.Status.PENDING
            )

        else:
            if payment_method and payment.payment_method != payment_method:
                return Response(
                    {"error": "A payment already exists for this order with another payment method"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if payment.payment_method == Payment.Method.COD:

            if order.status in ["CANCELLED", "DELIVERED"]:
                return Response(
                    {"error": "Payment cannot be created for a cancelled or completed order"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order.status = "CONFIRMED"

            order.save()



        serializer = PaymentSerializer(payment)


        return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


    @action(detail=True,methods=["post"],url_path="stripe-checkout")
    def stripe_checkout(self, request, pk=None):
        payment=self.get_object()
        if payment.payment_method != Payment.Method.STRIPE:
            return Response(
            {
                "error":
                "This payment is not Stripe"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        if payment.payment_status == Payment.Status.PAID:
            return Response(
            {
                "error":
                "Payment already completed"
            },
            status=status.HTTP_400_BAD_REQUEST
        )  
        
        stripe.api_key = settings.STRIPE_SECRET_KEY   
        session = stripe.checkout.Session.create(
            payment_method_types=[
                "card"
            ],


            line_items=[
                {
                "price_data": {

                    "currency":
                    payment.currency.lower(),


                    "product_data": {

                        "name":
                        payment.order.order_number

                    },


                    "unit_amount":

                    int(payment.amount * 100),

                },

                "quantity": 1,

            }
        ],


        mode="payment",


        # success_url=
        # "http://localhost:5173/payment-success",
        success_url=(
        f"http://localhost:5173/payment-success"
        f"?payment_id={payment.id}"
        ),


        cancel_url=
        "http://localhost:5173/payment-failed",

    )
        payment.stripe_session_id = session.id
        payment.save()
        return Response(
        {
            "checkout_url":
            session.url
        },
        status=status.HTTP_200_OK
    )
    @action(detail=True , methods=['PATCH'] , url_path="success")
    def payment_succcess(self , request , pk=None):
        payment=self.get_object()
        if payment.payment_status == Payment.Status.PAID:
            return Response(
            {
                "error": "Payment already completed"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        payment.payment_status = Payment.Status.PAID
        payment.transaction_id = request.data.get("transaction_id",payment.transaction_id)

        payment.save()

        order = payment.order
        order.status = "CONFIRMED"
        order.save()
        return Response(
        {
            "message":
            "Payment successful"
        },
        status=status.HTTP_200_OK
    )
    @action(detail=True, methods=["patch"], url_path="failed")
    def payment_failed(self, request, pk=None):
        payment = self.get_object()
        if payment.payment_status == Payment.Status.PAID:
            return Response(
            {
                "error": "Paid payment cannot be marked as failed"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        if payment.payment_status == Payment.Status.FAILED:
            return Response(
            {
                "error": "Payment already failed"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        payment.payment_status = Payment.Status.FAILED
        payment.save()
        return Response(
            {
                "message": "Payment failed"
        },
        status=status.HTTP_200_OK
    )
        

@csrf_exempt
@api_view(["POST"])
def stripe_webhook(request):

    payload = request.body

    sig_header = request.META.get(
        "HTTP_STRIPE_SIGNATURE"
    )

    try:

        event = stripe.Webhook.construct_event(
            payload,

            sig_header,

            settings.STRIPE_WEBHOOK_SECRET

        )


    except ValueError:

        return HttpResponse(
            status=400
        )


    except stripe.error.SignatureVerificationError:

        return HttpResponse(
            status=400
        )



    if event["type"] == "checkout.session.completed":


        session = event["data"]["object"]


        session_id = session["id"]


        try:

            payment = Payment.objects.get(

                stripe_session_id=session_id

            )

            if payment.payment_status != Payment.Status.PAID:
                payment.payment_status = Payment.Status.PAID

                payment.transaction_id = session[
                "payment_intent"
            ]

                payment.save()



                order = payment.order

                order.status = "CONFIRMED"

                order.save()
                print("CREATING DELIVERY TRACKING")
                DeliveryTracking.objects.get_or_create(
                    order=order,
                    defaults={
                        "status":
                        DeliveryTracking.Status.PENDING
                    }
                )
                Notification.objects.create(
                    user=order.user,
                    title="Payment Successful",
                    message=(
                        f"Payment received for "
                        f"order {order.order_number}."
                        )
                )
                send_email_notification(
                    order.user.email,
                    "Payment Successful",
                    f"""
                    Your payment is confirmed.
                    Order:
                    {order.order_number}
                    Amount:
                    {payment.amount}
                    Transaction:
                   {payment.transaction_id}
                   """
                )
        except Payment.DoesNotExist:
            print(
                "PAYMENT NOT FOUND",session_id)
            if event["type"] == "checkout.session.completed":

                print("STRIPE PAYMENT COMPLETED EVENT AYA")


    return HttpResponse(
        status=200
    )
           

            

     































#            python manage.py runserver