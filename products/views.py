from django.shortcuts import render
from . models import Category , Product 
from . serializers import CategorySerializer , ProductSerializer
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import F
from django.db.models import ExpressionWrapper
from django.db.models import DecimalField
from django.db.models import Avg
from .filters import ProductFilter


# Create your views here.
@extend_schema(
    description="Category operations"
    
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer
    parser_classes = (
        MultiPartParser,
        FormParser,
    )
    @action(detail=True, methods=['get'], url_path='products')
    def productsofcategory(self, request , pk=True):
        try:
            category=Category.objects.get(id=pk)
        except:
            return Response(
                {'message':'NO category found given query .....'},
                status=status.HTTP_400_BAD_REQUEST
            )    
        products=category.products.all()
        totat_products=products.count()
        serializer = ProductSerializer(products, many=True)
        return Response(
            {
                "category_id":category.id,
                "category_name":category.name,
                "total_products":totat_products,
                "products data":serializer.data,
             } , status=status.HTTP_200_OK)
@extend_schema(
    description="Product operations"
)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.annotate(
    average_rating=Avg("reviews__rating"),

    off_percentage=ExpressionWrapper(
        ((F("price") - F("discount_price")) * 100) / F("price"),
        output_field=DecimalField(max_digits=10, decimal_places=2)
    )
)
    serializer_class=ProductSerializer
    filterset_class = ProductFilter
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter,]
    search_fields = [
        "name",
        "brand",
        "category__name",
    ]

    filterset_fields = [
        "category",
        "stock_status",
        "is_active",
    ]

    ordering_fields = [
        "price",
        "discount_price",
        "created_at",
        "average_rating",
        "off_percentage"
    ]

    ordering = ["-created_at"]
    parser_classes = (
        MultiPartParser,
        FormParser,
    )