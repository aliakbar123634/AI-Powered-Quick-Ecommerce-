from rest_framework import serializers
from .models import CustomUserModel , Address , NewsletterSubscriber
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError



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