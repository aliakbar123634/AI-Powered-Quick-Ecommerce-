from django.shortcuts import render
from . models import Category , Product  , Wishlist
from . serializers import CategorySerializer , ProductSerializer , WishlistSerializer
from rest_framework import viewsets
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
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import ( extend_schema, extend_schema_view, OpenApiResponse)
from django.db.models import Q


# Create your views here.
@extend_schema(
    description="Category operations"
    
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset=Category.objects.all()
    # sql query to get all categories

    serializer_class=CategorySerializer
    parser_classes = (
        MultiPartParser,
        FormParser,
    )
    lookup_field = "slug"
    @action(detail=True, methods=['get'], url_path='products')
    def productsofcategory(self, request , slug=None):
        try:
            category = self.get_object()
        except:
            return Response(
                {'message':'NO category found given query .....'},
                status=status.HTTP_400_BAD_REQUEST
            )    
        products=category.products.all()
        serializer = ProductSerializer(
            products,
            many=True
        )

        return Response(
            {
                "category_id": category.id,
                "category_name": category.name,
                "category_slug": category.slug,
                "category_description": category.description,
                "category_image": request.build_absolute_uri(category.image.url)
                if category.image else None,
                "total_products": products.count(),
                "products": serializer.data,
            },
            status=status.HTTP_200_OK
        )


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
    #   deals action
    @action(detail=False, methods=["get"], url_path="deals")
    def products_deal(self, request): 
        try:
            product=Product.objects.filter(discount_price__isnull=False,is_active=True)   
        except :
            return Response({"message":"No deal available"} , status=status.HTTP_400_BAD_REQUEST)  
        serializer=ProductSerializer(product , many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"], url_path="recommendations")
    def recommendations(self, request):

        query = request.query_params.get("search", "").strip()
        search_type = request.query_params.get("type", "category").strip().lower()

    # Only active + in-stock products
        queryset = Product.objects.filter(
        is_active=True,
        stock_status=True
    )

    # ============================================================
    # 1. CATEGORY RECOMMENDATIONS
    # ============================================================

        if search_type == "category":

            if not query:
                return Response(
                {
                    "count": 0,
                    "results": []
                },
                status=status.HTTP_200_OK
            )

            queryset = queryset.filter(
            category__name__icontains=query
        )

    # ============================================================
    # 2. PRODUCT RECOMMENDATIONS
    # ============================================================

        elif search_type == "product":

            if not query:
                return Response(
                {
                    "count": 0,
                    "results": []
                },
                status=status.HTTP_200_OK
            )

        # Find the actual product first
            product = Product.objects.filter(
            Q(name__iexact=query) |
            Q(name__icontains=query) |
            Q(brand__iexact=query)
        ).first()

        # Product doesn't exist
            if not product:
                return Response(
                {
                    "count": 0,
                    "results": []
                },
                status=status.HTTP_200_OK
            )

        # Find RELATED products from same category
            queryset = queryset.filter(
            category=product.category
        ).exclude(
            id=product.id
        )

    # ============================================================
    # 3. INVALID SEARCH TYPE
    # ============================================================

        else:

            return Response(
            {
                "detail": "type must be either 'category' or 'product'."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # ============================================================
    # 4. RANKING
    # ============================================================

        queryset = (
        queryset
        .annotate(
            average_rating=Avg("reviews__rating")
        )
        .order_by(
            "-average_rating",
            "-created_at"
        )[:10]
    )

    # ============================================================
    # 5. SERIALIZE
    # ============================================================

        serializer = ProductSerializer(
        queryset,
        many=True,
        context={"request": request}
    )

        return Response(
        {
            "count": queryset.count(),
            "results": serializer.data
        },
        status=status.HTTP_200_OK
    )




 
@extend_schema_view(
    list=extend_schema(
        summary="Get Wishlist",
        description="Retrieve all wishlist products of the authenticated user.",
        responses={200: WishlistSerializer(many=True)},
    ),
    add_to_wishlist=extend_schema(
        summary="Add Product To Wishlist",
        description="Add a product to the authenticated user's wishlist.",
        responses={
            201: WishlistSerializer,
            400: OpenApiResponse(description="Product already exists in wishlist"),
            404: OpenApiResponse(description="Product not found"),
        },
    ),
    remove_from_wishlist=extend_schema(
        summary="Remove Product From Wishlist",
        description="Remove a product from the authenticated user's wishlist.",
        responses={
            200: OpenApiResponse(description="Product removed successfully"),
            404: OpenApiResponse(description="Product not found in wishlist"),
        },
    ),
)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="add")
    def add_to_wishlist(self, request):

        product_id = request.data.get("product")

        if not product_id:
            return Response(
                {"error": "Product id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product = Product.objects.get(id=product_id)

        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if Wishlist.objects.filter(
            user=request.user,
            product=product
        ).exists():

            return Response(
                {"error": "Product already exists in wishlist"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        wishlist = Wishlist.objects.create(
            user=request.user,
            product=product,
        )

        serializer = WishlistSerializer(wishlist)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["delete"], url_path="remove")
    def remove_from_wishlist(self, request):

        product_id = request.data.get("product")

        if not product_id:
            return Response(
                {"error": "Product id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            wishlist = Wishlist.objects.get(
                user=request.user,
                product_id=product_id,
            )

        except Wishlist.DoesNotExist:
            return Response(
                {"error": "Product not found in wishlist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        wishlist.delete()

        return Response(
            {"message": "Product removed from wishlist"},
            status=status.HTTP_200_OK,
        )
