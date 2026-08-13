from django.urls import path , include
from . import views
from rest_framework import routers

router=routers.DefaultRouter()
router.register(r'cart', views.CartViewSet)
router.register(r'cartitems', views.CartItemViewSet)
router.register(r'order', views.OrderViewSet)
router.register(r'orderitems', views.OrderItemsViewSet)


urlpatterns=[
    path('', include(router.urls)),
]