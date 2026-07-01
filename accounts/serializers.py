from rest_framework import serializers
from .models import CustomUserModel , Address


class CustomUserSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    password2=serializers.CharField(write_only=True)    
    class Meta:
        model=CustomUserModel
        fields=[ "email", "name",  "phone_number",  "password", "password2",]
    def validate(self, attrs):
        pass1=attrs.get('password')
        pass2=attrs.get('password2')
        if pass1 != pass2:
            raise serializers.ValidationError("password and confirm password are not similar....")
        return attrs
    def create(self, validated_data):
        validated_data.pop('password2')
        user=CustomUserModel.objects.create_user(**validated_data)
        return user

    
          

class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()        
    password=serializers.CharField(write_only=True)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "title",
            "city",
            "area",
            "street",
            "formatted_address",
            "latitude",
            "longitude",
            "is_default",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
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