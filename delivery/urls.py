from rest_framework.routers import DefaultRouter

from .views import DeliveryTrackingViewSet



router = DefaultRouter()


router.register(

    "tracking",

    DeliveryTrackingViewSet,

    basename="tracking"

)



urlpatterns = router.urls
