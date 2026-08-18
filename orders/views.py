from django.shortcuts import render
from accounts.utils import distance
from . models import Cart , CartItem , Order , OrderItem
from . serializers import CartSerializer , CartItemSerializer  , AddToCartSerializer , OrderItemSerializers , OrderSerializer
from rest_framework.decorators import action
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated 
from products.models import Product
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from accounts.models import Address
from decimal import Decimal
from accounts.utils.distance import calculate_distance

import stripe

from django.conf import settings
from django.http import HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Order, Payment


stripe.api_key = settings.STRIPE_SECRET_KEY
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
# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class=OrderSerializer
#     permission_classes = [IsAuthenticated] 
#     def get_queryset(self):

#        return Order.objects.filter(
#             user=self.request.user
#     )
#     @action(detail=False, methods=['post'], url_path='create')
#     def create_order(self , request):
#         # print("=" * 50)
#         # print("CREATE ORDER API HIT")
#         # print("=" * 50)
#         user=request.user
#         address_id = request.data.get("address")
#         try:
#             cart = Cart.objects.get(user=user)
#         except Cart.DoesNotExist:
#             return Response(
#                 {"error": "Cart not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         if not cart.items.exists():
#            return Response(
#               {"error": "Cart is empty"},
#               status=status.HTTP_400_BAD_REQUEST
#             )
#         try:
#             address = Address.objects.get(
#             id=address_id,
#             user=user
#             )
#         except Address.DoesNotExist:
#             return Response(
#         {"error": "Invalid address"},
#         status=status.HTTP_404_NOT_FOUND
#         )
#         STORE_LATITUDE = 29.395600
#         STORE_LONGITUDE = 71.683600

#         MAX_DISTANCE = 10


#         distance = calculate_distance(

#             STORE_LATITUDE,

#             STORE_LONGITUDE,

#             address.latitude,

#             address.longitude

#         )
#         if distance > MAX_DISTANCE:

#             return Response(
#                 {
#                 "error":
#                 "Sorry delivery is not available in your area",

#                 "distance_km":
#                 distance
#             },
#             status=status.HTTP_400_BAD_REQUEST
#             )
#         with transaction.atomic():
#             # print("Using Price:", product_price)
#             order=Order.objects.create(            
#                 user=user,
#                 address=address,
#                 # address snapshot
#                 delivery_address=address.formatted_address,

#                 delivery_city=address.city,

#                 delivery_state=address.state,

#                 delivery_country=address.country,

#                 delivery_postal_code=address.postal_code,

#                 delivery_latitude=address.latitude,

#                 delivery_longitude=address.longitude,
#                 total_price=0,
#                 delivery_fee=0,
#                 discount=0,
#                 subtotal=0
#                 )
#             total_price=0
#             delivery_fee=0
#             discount=0
#             subtotal=0
#             if distance <= 3:
#                delivery_fee = Decimal("100")
#             elif distance <= 7:
#                delivery_fee = Decimal("200")
#             else:
#                 delivery_fee = Decimal("300")
#             for item in cart.items.all():
#                 # Agar discount_price hai to wahi use karo
#                 product_price = (
#                     item.product.discount_price
#                     if item.product.discount_price is not None
#                     else item.product.price
#                      )
#                 print("Original Price:", item.product.price)
#                 print("Discount Price:", item.product.discount_price)
#                 print("Using Price:", product_price)    
#                 OrderItem.objects.create(
#                 order=order,
#                 product=item.product,
#                 quantity=item.quantity,
#                 price=product_price
#                 )
#             subtotal += product_price * item.quantity
#                 # delivery_fee = product_price * Decimal("0.05")
#             discount=product_price * Decimal("0.03")
#             total_price=(subtotal-discount)+delivery_fee
#             order.total_price = total_price
#             order.discount=discount
#             order.delivery_fee=delivery_fee
#             order.subtotal=subtotal
#             order.save()
#             cart.items.all().delete()
#         serializer=OrderSerializer(order)
#         return Response(
#             serializer.data,
#             status=status.HTTP_201_CREATED
#         )    
class OrderViewSet(viewsets.ModelViewSet):

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
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



        STORE_LATITUDE = 29.395600

        STORE_LONGITUDE = 71.683600


        MAX_DISTANCE = 10



        distance = calculate_distance(

            STORE_LATITUDE,

            STORE_LONGITUDE,

            address.latitude,

            address.longitude

        )



        if distance > MAX_DISTANCE:

            return Response(

                {

                    "error":
                    "Sorry delivery is not available in your area",

                    "distance_km": distance

                },

                status=status.HTTP_400_BAD_REQUEST

            )



        with transaction.atomic():


            order = Order.objects.create(

                user=user,

                address=address,


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
    #     if order_of_id.user != request.user:
    #         return Response(
    #     {"error": "You are not allowed to cancel this order"},
    #     status=status.HTTP_403_FORBIDDEN
    #    ) 
        if order_of_id.status == "CANCELLED":
            return Response(
        {"error": "Order already cancelled"},
        status=status.HTTP_400_BAD_REQUEST
       )
        order_of_id.status='CANCELLED'
        order_of_id.save()
        return Response({
            "message":"order cancelled successfully......"
        }, status=status.HTTP_200_OK)



@extend_schema(
    description="Order item operations"
    
)
class OrderItemsViewSet(viewsets.ModelViewSet):
    queryset=OrderItem.objects.all()  
    serializer_class=OrderItemSerializers
    permission_classes = [IsAuthenticated]   







@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment(request):
    """
    Create a payment record for an existing order.
    """

    order_id = request.data.get("order_id")
    payment_method = request.data.get("payment_method")

    if not order_id:
        return Response(
            {"error": "order_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not payment_method:
        return Response(
            {"error": "payment_method is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        order = Order.objects.get(
            id=order_id,
            user=request.user
        )
    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Prevent duplicate payment records
    payment, created = Payment.objects.get_or_create(
        order=order,
        defaults={
            "amount": order.total_price,
            "payment_method": payment_method,
            "payment_status": Payment.Status.PENDING,
        }
    )

    # If payment already exists, update method if still pending
    if not created and payment.payment_status == Payment.Status.PENDING:
        payment.payment_method = payment_method
        payment.amount = order.total_price
        payment.save(
            update_fields=[
                "payment_method",
                "amount",
            ]
        )

    return Response(
        {
            "id": payment.id,
            "order_id": order.id,
            "amount": str(payment.amount),
            "payment_method": payment.payment_method,
            "payment_status": payment.payment_status,
        },
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def stripe_checkout(request, payment_id):
    """
    Create Stripe Checkout Session for a payment.
    """

    try:
        payment = Payment.objects.select_related("order").get(
            id=payment_id,
            order__user=request.user
        )
    except Payment.DoesNotExist:
        return Response(
            {"error": "Payment not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if payment.payment_method != Payment.Method.STRIPE:
        return Response(
            {"error": "This payment is not a Stripe payment."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if payment.payment_status == Payment.Status.PAID:
        return Response(
            {"error": "Payment has already been completed."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        # Reuse existing Stripe session if available
        if payment.stripe_session_id:

            try:
                existing_session = stripe.checkout.Session.retrieve(
                    payment.stripe_session_id
                )

                if existing_session.status == "open":
                    return Response(
                        {
                            "checkout_url": existing_session.url
                        },
                        status=status.HTTP_200_OK
                    )

            except stripe.error.StripeError:
                pass

        session = stripe.checkout.Session.create(

            payment_method_types=["card"],

            line_items=[
                {
                    "price_data": {
                        "currency": payment.currency.lower(),

                        "product_data": {
                            "name": f"Order {payment.order.order_number}",
                        },

                        "unit_amount": int(
                            payment.amount * 100
                        ),
                    },

                    "quantity": 1,
                }
            ],

            mode="payment",

            success_url=(
                "http://localhost:5174/order-success"
                "?session_id={CHECKOUT_SESSION_ID}"
            ),

            cancel_url=(
                "http://localhost:5174/payment"
            ),

            metadata={
                "payment_id": str(payment.id),
                "order_id": str(payment.order.id),
            },
        )

        payment.stripe_session_id = session.id
        payment.save(update_fields=["stripe_session_id"])

        return Response(
            {
                "checkout_url": session.url,
                "session_id": session.id,
            },
            status=status.HTTP_200_OK
        )

    except stripe.error.StripeError as e:

        return Response(
            {
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([])
def stripe_webhook(request):
    """
    Stripe webhook endpoint.
    """

    payload = request.body

    sig_header = request.META.get(
        "HTTP_STRIPE_SIGNATURE"
    )

    webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    try:

        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            webhook_secret
        )

    except ValueError:

        return HttpResponse(
            "Invalid payload",
            status=400
        )

    except stripe.error.SignatureVerificationError:

        return HttpResponse(
            "Invalid signature",
            status=400
        )

    # Payment completed
    if event["type"] == "checkout.session.completed":

        session = event["data"]["object"]

        payment_id = session.get("metadata", {}).get(
            "payment_id"
        )

        order_id = session.get("metadata", {}).get(
            "order_id"
        )

        if payment_id:

            try:

                payment = Payment.objects.get(
                    id=payment_id
                )

                payment.payment_status = Payment.Status.PAID

                payment.transaction_id = session.get(
                    "payment_intent"
                )

                payment.save(
                    update_fields=[
                        "payment_status",
                        "transaction_id",
                    ]
                )

                # Confirm order after successful Stripe payment
                if order_id:

                    try:

                        order = Order.objects.get(
                            id=order_id
                        )

                        if order.status == "PENDING":
                            order.status = "CONFIRMED"
                            order.save(
                                update_fields=["status"]
                            )

                    except Order.DoesNotExist:
                        pass

            except Payment.DoesNotExist:
                pass

    # Payment failed
    elif event["type"] == "checkout.session.async_payment_failed":

        session = event["data"]["object"]

        payment_id = session.get("metadata", {}).get(
            "payment_id"
        )

        if payment_id:

            try:

                payment = Payment.objects.get(
                    id=payment_id
                )

                payment.payment_status = Payment.Status.FAILED

                payment.save(
                    update_fields=["payment_status"]
                )

            except Payment.DoesNotExist:
                pass

    return HttpResponse(
        "Webhook received",
        status=200
    )


#           python manage.py runserver

































#            python manage.py runserver