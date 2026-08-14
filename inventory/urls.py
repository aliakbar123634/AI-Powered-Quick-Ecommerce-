from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()

router.register(r"warehouses", views.WarehouseViewSet)
router.register(r"stocks", views.InventoryViewSet)

urlpatterns = [
    path("", include(router.urls)),
]