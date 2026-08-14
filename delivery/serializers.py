from rest_framework import serializers
from .models import DeliveryTracking

class DeliveryTrackingSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(
        source="order.order_number",
        read_only=True
    )

    rider_email = serializers.CharField(
        source="rider.user.email",
        read_only=True
    )

    rider_name = serializers.CharField(
        source="rider.user.name",
        read_only=True
    )
    rider_image = serializers.ImageField(
    source="rider.user.profile_image",
    read_only=True
    )
    rider_phone = serializers.CharField(
        source="rider.user.phone_number",
        read_only=True
    )

    rider_vehicle = serializers.CharField(
        source="rider.vehicle_type",
        read_only=True
    )

    rider_rating = serializers.FloatField(
        source="rider.rating",
        read_only=True
    )
    rider_latitude = serializers.DecimalField(
    source="rider.current_latitude",
    max_digits=9,
    decimal_places=6,
    read_only=True
   )
    rider_longitude = serializers.DecimalField(
    source="rider.current_longitude",
    max_digits=9,
    decimal_places=6,
    read_only=True
    )
    class Meta:
        model = DeliveryTracking
        fields = "__all__"
