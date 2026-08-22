from django.contrib import admin
from django.urls import path, include
from . import views
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'profiles', views.ProfileViewSet, basename='profile')
router.register(r'addresses', views.AddressViewSet, basename='address')

urlpatterns = [
    path("", include(router.urls)),
    path( "delivery/check/", views.DeliveryCheckAPIView.as_view(), name="delivery-check",),
    path('register/' , views.RegisterView.as_view() , name='register'),
    path('login/' , views.LoginView.as_view() , name='login'),
    path('logout/' , views.LogoutView.as_view() , name='logout'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path("forgot-password/",ForgotPasswordView.as_view(),name="forgot-password"),
    path("reset-password/",ResetPasswordView.as_view(),name="reset-password" ),
    path("api/newsletter/",NewsletterSubscribeView.as_view() , name="newsletter"),
]

# #            python manage.py startapp products