from django.urls import path , include
from . import views
from rest_framework import routers
from .views import SemanticSearchView
from .views import ChatAPIView

router=routers.DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products' , views.ProductViewSet)
router.register( r'wishlist', views.WishlistViewSet, basename='wishlist')

urlpatterns=[
    path('', include(router.urls)),
    path("semantic-search/",SemanticSearchView.as_view(),name="semantic-search"),
    path("chat/", ChatAPIView.as_view(), name="chat"),
]