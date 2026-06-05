from django.shortcuts import render
from . models import CustomUserModel
from .serializers import CustomUserSerializer , LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate , login
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

@extend_schema(
    summary="Register User",
    description="Create a new user account using email and password.",
    request=CustomUserSerializer,
    responses={
        201: CustomUserSerializer,
        400: None,
    },
    tags=["Authentication"]
)
class RegisterView(APIView):
    def post(self , request):
        serializer=CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"User registered successfully .........."} , status=status.HTTP_201_CREATED)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST )    

@extend_schema(
    summary="Login User",
    description="Login user using email and password.",
    request=LoginSerializer,
    responses={
        200: LoginSerializer,
        400: None,
    },
    tags=["Authentication"]
)
class LoginView(APIView):
    def post(self, request):
        serializer=LoginSerializer(data=request.data)
        if serializer.is_valid():
            email=serializer.validated_data.get('email')
            password=serializer.validated_data.get('password')
            user=authenticate(request , username=email , password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                # login(request , user)
                return Response(
                    {
                        "message": "Login successfully",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    status=status.HTTP_200_OK
                )
            return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST )   


            
