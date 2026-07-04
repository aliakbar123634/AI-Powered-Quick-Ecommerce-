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


#           python manage.py runserver

































#            python manage.py runserver