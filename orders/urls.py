from django.urls import path , include
from . import views
from rest_framework import routers

router=routers.DefaultRouter()
router.register(r'cart', views.CartViewSet)
router.register(r'cartitems', views.CartItemViewSet)
router.register(r'order', views.OrderViewSet)
router.register(r'orderitems', views.OrderItemsViewSet)
# path("payment/create-payment/", views.create_payment, name="create-payment"),



urlpatterns = [

    # Existing router URLs
    path('', include(router.urls)),

    # Payment
    path(
        'payment/create-payment/',
        views.create_payment,
        name='create-payment'
    ),

    path(
        'payment/<int:payment_id>/stripe-checkout/',
        views.stripe_checkout,
        name='stripe-checkout'
    ),

    # Stripe Webhook
    path(
        'stripe/webhook/',
        views.stripe_webhook,
        name='stripe-webhook'
    ),
]