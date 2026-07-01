from . models import Category , Product
from rest_framework import serializers
from django.db.models import Avg
from decimal import Decimal
from .models import ProductImage
from .models import Review

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    class Meta:
        model=Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "image",
            "products_count"
        ]
        read_only_fields=['slug']
    def get_products_count(self, obj):
        return obj.products.count() 

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "name",
            "rating",
            "comment",
            "created_at",
        ]

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_primary"]        
        
class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    reviews_count = serializers.SerializerMethodField()
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )
    off=serializers.SerializerMethodField()
    images = ProductImageSerializer(
        many=True,
        read_only=True
    )
    reviews = ReviewSerializer(
        many=True,
        read_only=True
    )
    class Meta:
        model=Product
        fields='__all__'
        read_only_fields=['slug' , 'created_at' , 'updated_at' , 'average_rating' ,'reviews_count' , "category_name" , "off"]
    def get_average_rating(self, obj):
        return obj.reviews.aggregate(
            Avg("rating")
        )["rating__avg"]

    def get_reviews_count(self, obj):
        return obj.reviews.count()  
    def get_off(self, obj):
        if not obj.discount_price:
            return 0
        discount_amount = obj.price - obj.discount_price
        return round((discount_amount / obj.price) * Decimal("100"))
    def validate(self , data):
        price = data.get("price")
        
        discount_price = data.get("discount_price")
        
        if price is not None and price < 0:
            raise serializers.ValidationError(
                "Price must be a positive number."
               )

        if discount_price is not None:
            if discount_price < 0:
                raise serializers.ValidationError(
            "Discount price must be a positive number."
        )
        if price is not None and discount_price is not None:
            if discount_price > price:
                 raise serializers.ValidationError(
                "Discount price must be less than regular price."
            )
        return data

       