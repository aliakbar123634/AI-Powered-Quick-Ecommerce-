from rest_framework.routers import DefaultRouter
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


urlpatterns = router.urls
