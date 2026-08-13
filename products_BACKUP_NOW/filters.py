import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):

    price__gte = django_filters.NumberFilter(
        field_name="discount_price",
        lookup_expr="gte"
    )

    price__lte = django_filters.NumberFilter(
        field_name="discount_price",
        lookup_expr="lte"
    )

    rating_gte = django_filters.NumberFilter(
        field_name="average_rating",
        lookup_expr="gte"
    )

    discount_gte = django_filters.NumberFilter(
        field_name="off_percentage",
        lookup_expr="gte"
    )        
    class Meta:
        model = Product
        fields = [
            "category",
            "stock_status",
        ]