from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'profiles', views.ProfileViewSet, basename='profile')

urlpatterns = [
    path("", include(router.urls)),
    path('register/' , views.RegisterView.as_view() , name='register'),
    path('login/' , views.LoginView.as_view() , name='login'),
    path('logout/' , views.LogoutView.as_view() , name='logout'),
    path(
        'token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
]

# #            python manage.py startapp products