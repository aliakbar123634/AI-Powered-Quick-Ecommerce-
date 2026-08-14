from rest_framework import serializers
from .models import Warehouse, Inventory

class WarehouseSerializer(serializers.ModelSerializer):
    total_products = serializers.SerializerMethodField()
    class Meta:
        model = Warehouse
        fields = [
            "id",

            "name",

            "city",

            "area",

            "latitude",

            "longitude",

            "service_radius_km",

            "is_active",

            "total_products",

        ]

        read_only_fields = [

            "id",

            "total_products",

        ]


    def get_total_products(self, obj):
        return obj.inventory.count()




class InventorySerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    warehouse_name = serializers.CharField(
        source="warehouse.name",
        read_only=True
    )

    is_low_stock = serializers.SerializerMethodField()


    class Meta:

        model = Inventory


        fields = [

            "id",

            "warehouse",

            "warehouse_name",

            "product",

            "product_name",

            "quantity",

            "reorder_level",

            "is_low_stock",

            "updated_at",

        ]


        read_only_fields = [

            "id",

            "warehouse_name",

            "product_name",

            "is_low_stock",

            "updated_at",

        ]



    def get_is_low_stock(self, obj):

        return obj.quantity <= obj.reorder_level

