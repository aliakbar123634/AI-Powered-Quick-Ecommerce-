from rest_framework import serializers
from .models import CustomUserModel

class CustomUserSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    password2=serializers.CharField(write_only=True)    
    class Meta:
        model=CustomUserModel
        fields=['id','email' , 'name' , 'password' , 'password2' , 'created_at' , 'updated_at','role' , 'phone_number']
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