from rest_framework import serializers
from .models import CustomUserModel , Address , NewsletterSubscriber , RiderProfile
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from orders.models import Order
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomUserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password2 = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = CustomUserModel

        fields = [
            "email",
            "name",
            "phone_number",
            "password",
            "password2",
        ]

    def validate(self, attrs):

        password = attrs.get("password")
        password2 = attrs.get("password2")

        # 1. Confirm password
        if password != password2:
            raise serializers.ValidationError({
                "password2": "Passwords do not match."
            })

        # 2. Django password validators
        user = CustomUserModel(
            email=attrs.get("email"),
            name=attrs.get("name"),
        )

        try:
            password_validation.validate_password(
                password,
                user
            )
        except ValidationError as e:
            raise serializers.ValidationError({
                "password": list(e.messages)
            })

        return attrs

    def create(self, validated_data):

        validated_data.pop("password2")

        user = CustomUserModel.objects.create_user(
            **validated_data
        )

        return user     

class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()        
    password=serializers.CharField(write_only=True)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields="__all__"

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]


class ProfileSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = CustomUserModel

        fields = [
            "id",
            "name",
            "email",
            "phone_number",
            "profile_image",
            "bio",
            "date_of_birth",
            "role",
            "is_active",
            "created_at",
            "addresses",
        ]

        read_only_fields = [
            "id",
            "email",
            "role",
            "is_active",
            "created_at",
            "addresses",
        ]


class DeliveryCheckSerializer(serializers.Serializer):

    latitude = serializers.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = serializers.DecimalField(
        max_digits=9,
        decimal_places=6
    )


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()






class ResetPasswordSerializer(serializers.Serializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password2 = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        password = attrs["password"]
        password2 = attrs["password2"]

        if password != password2:
            raise serializers.ValidationError({
                "password2": "Passwords do not match."
            })

        try:
            password_validation.validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({
                "password": list(e.messages)
            })

        return attrs



class NewsletterSubscribeSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewsletterSubscriber
        fields = ["email"]

    def validate_email(self, value):

        value = value.lower().strip()

        if NewsletterSubscriber.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "This email is already subscribed."
            )

        return value


class RiderProfileSerializer(serializers.ModelSerializer):

    rider_email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    rider_name = serializers.CharField(
        source="user.name",
        read_only=True
    )

    class Meta:
        model = RiderProfile

        fields = [
            "id",
            "user",
            "rider_name",
            "rider_email",
            "vehicle_type",
            "availability_status",
            "current_latitude",
            "current_longitude",
            "rating",
        ]

        read_only_fields = [
            "id",
            "rider_name",
            "rider_email",
            "rating",
        ]    


# class RiderOrderSerializer(serializers.ModelSerializer):

#     customer_name = serializers.CharField(
#         source="user.name",
#         read_only=True
#     )

#     customer_phone = serializers.CharField(
#         source="user.phone_number",
#         read_only=True
#     )

#     delivery_status = serializers.CharField(
#         source="delivery.status",
#         read_only=True
#     )
#     delivery_id = serializers.IntegerField(
#         source="delivery.id",
#         read_only=True
#     )

#     class Meta:

#         model = Order

#         fields = [
#             "id",
#             "order_number",
#             "customer_name",
#             "customer_phone",
#             "total_price",
#             "delivery_status",
#             "delivery_id",
#             "status",
#             "created_at",
#         ]




# class RiderOrderSerializer(serializers.ModelSerializer):

#     customer_name = serializers.CharField(
#         source="user.name",
#         read_only=True
#     )

#     customer_phone = serializers.CharField(
#         source="user.phone_number",
#         read_only=True
#     )

#     delivery_status = serializers.SerializerMethodField()

#     delivery_id = serializers.SerializerMethodField()

#     class Meta:
#         model = Order

#         fields = [
#             "id",
#             "order_number",
#             "customer_name",
#             "customer_phone",
#             "total_price",
#             "delivery_status",
#             "delivery_id",
#             "status",
#             "created_at",
#         ]

#     def get_delivery_status(self, obj):
#         delivery = obj.deliverytracking_set.first()

#         if delivery:
#             return delivery.status

#         return None

#     def get_delivery_id(self, obj):
#         delivery = obj.deliverytracking_set.first()

#         if delivery:
#             return delivery.id

#         return None


class RiderOrderSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="user.name",
        read_only=True
    )

    customer_phone = serializers.CharField(
        source="user.phone_number",
        read_only=True
    )

    delivery_status = serializers.SerializerMethodField()
    delivery_id = serializers.SerializerMethodField()

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "customer_name",
            "customer_phone",
            "total_price",
            "delivery_status",
            "delivery_id",
            "status",
            "created_at",
        ]

    def get_delivery(self, obj):
        from delivery.models import DeliveryTracking

        return DeliveryTracking.objects.filter(
            order=obj
        ).first()

    def get_delivery_status(self, obj):
        delivery = self.get_delivery(obj)

        return delivery.status if delivery else None

    def get_delivery_id(self, obj):
        delivery = self.get_delivery(obj)

        return delivery.id if delivery else None