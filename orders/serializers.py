from .models import Cart ,  CartItem , Order , OrderItem
from rest_framework import serializers


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    product_price = serializers.DecimalField(
    source='product.price',
    max_digits=10,
    decimal_places=2,
    read_only=True
    )

    product_image = serializers.ImageField(
    source='product.image',
    read_only=True
    )
    subtotal=serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields=['id' , 'cart' ,'product' , 'product_name' , 'product_price','subtotal' , 'product_image' ,'quantity' , 'created_at']
        read_only_fields=['id' , 'created_at']

    def get_subtotal(self , obj):
        return obj.product.price * obj.quantity    


class CartSerializer(serializers.ModelSerializer):

    useremail = serializers.CharField(
    source='user.email',
    read_only=True
    )

    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()    
    class Meta:
        model = Cart
        fields = [
            'id',
            'user',
            'useremail',
            'items',
            'total_items',
            'total_price',
            'created_at',
            'updated_at'
        ] 
        read_only_fields=['id','user','created_at','updated_at']  
    def get_total_items(self , obj):
        total=0
        for i in obj.items.all():
            total += i.quantity   
        return total   
    def get_total_price(self, obj):
        total=0
        for i in obj.items.all():
            total += i.product.price * i.quantity
        return total    

             


class AddToCartSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1)        
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than 0"
            )
        return value

class OrderItemSerializers(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )

    product_image = serializers.ImageField(
        source='product.image',
        read_only=True
    )

    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_discount_price = serializers.DecimalField(
        source='product.discount_price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'order',
            'product',
            'product_name',
            'product_image',
            'product_price',
            'product_discount_price',
            'subtotal',
            'quantity',
            'price'
        ]
        read_only_fields = ['id', 'price' , 'order']

    def validate(self, attrs):
        quantity = attrs.get('quantity')

        if quantity is not None and quantity <= 0:
            raise serializers.ValidationError(
                "Quantity should be more than zero"
            )

        return attrs

    def get_subtotal(self, obj):
        return obj.price * obj.quantity




class OrderSerializer(serializers.ModelSerializer):
    total_items = serializers.SerializerMethodField()
    items = OrderItemSerializers(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "Warehouse",
            "rider",
            "address",
            "order_number",
            "items",
            "total_items",
            "status",
            "subtotal",
            "delivery_fee",
            "discount",
            "total_price",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "order_number",
            "status",
            "subtotal",
            "delivery_fee",
            "discount",
            "total_price",
            "created_at",
        ]

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())        



#         python manage.py runserver