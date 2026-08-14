from django.shortcuts import render
from django.db.models import F

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from .models import Warehouse, Inventory
from .serializers import (
    WarehouseSerializer,
    InventorySerializer
)


class WarehouseViewSet(viewsets.ModelViewSet):

    queryset = Warehouse.objects.all()

    serializer_class = WarehouseSerializer

    permission_classes = [IsAdminUser]

    @action(
        detail=True,
        methods=["get"],
        url_path="stock"
    )
    def warehouse_stock(self, request, pk=None):

        warehouse = self.get_object()

        inventory = Inventory.objects.filter(
            warehouse=warehouse
        )

        serializer = InventorySerializer(
            inventory,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class InventoryViewSet(viewsets.ModelViewSet):

    queryset = Inventory.objects.select_related(
        "warehouse",
        "product"
    )

    serializer_class = InventorySerializer

    permission_classes = [IsAdminUser]

    @action(
        detail=False,
        methods=["get"],
        url_path="low-stock"
    )
    def low_stock(self, request):

        inventory = Inventory.objects.filter(
            quantity__lte=F("reorder_level")
        )

        serializer = InventorySerializer(
            inventory,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )