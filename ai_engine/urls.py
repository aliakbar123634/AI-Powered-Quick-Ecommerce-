from rest_framework.routers import DefaultRouter
from django.urls import path , include
from . import views
from .views import *
router = DefaultRouter()

router.register(
    "search-history",
    SearchHistoryViewSet,
    basename="search-history"
)

router.register(
    "preferences",
    UserPreferenceViewSet,
    basename="preferences"
)

router.register(
    "recommendations",
    RecommendationViewSet,
    basename="recommendations"
)

router.register(
    "chat",
    ChatViewSet,
    basename="chat"
)

router.register(
    "analytics",
    AnalyticsViewSet,
    basename="analytics"
)

router.register(
    "memory",
    MemoryViewSet,
    basename="memory"
)


urlpatterns = [
    path('', include(router.urls)),
    path(
        "knowledge-chat/",
        KnowledgeChatView.as_view(),
        name="knowledge-chat"
    ),
]
# urlpatterns = router.urls
