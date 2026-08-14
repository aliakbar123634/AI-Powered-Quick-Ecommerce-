from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

import accounts
from main import settings

urlpatterns = [
    path('admin/' , admin.site.urls),
    # API Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),

    # Swagger UI
    path(
        'api/docs/',
        SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui',
    ),

    # Redoc
    path(
        'api/redoc/',
        SpectacularRedocView.as_view(url_name='schema'),
        name='redoc',
    ),
    path('api/accounts/' , include('accounts.urls')),
    path('api/products/' , include('products.urls')),
    path('api/orders/' , include('orders.urls')),
    path('api/inventory/' ,include('inventory.urls') ),
    path('api/notification/' ,include('notifications.urls')),
    path("api/delivery/", include("delivery.urls")),
    path("api/ai_engine/", include("ai_engine.urls")),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
#              cd quickai-ai
#              cd main
#              python manage.py runserver
#              stripe listen --forward-to localhost:8000/api/orders/stripe/webhook/
#              cd frontend    
#              npm run dev 
#              python -m venv venv
#              venv\Scripts\activate
#              python -m uvicorn app.main:app --reload --port 8001

#              deactivate
