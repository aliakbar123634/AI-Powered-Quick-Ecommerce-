from django.shortcuts import render
from . models import CustomUserModel
from .serializers import CustomUserSerializer , LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate , login , logout
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomUserModel
from .serializers import ProfileSerializer
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
            return Response({"message":"User registered successfully .........." , "user": serializer.data
} , status=status.HTTP_201_CREATED)
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

        print("REQUEST DATA =", request.data)

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            email = serializer.validated_data.get("email")
            password = serializer.validated_data.get("password")

            print("EMAIL =", email)
            print("PASSWORD =", password)

            user = authenticate(
                request,
                username=email,
                password=password
            )

            print("USER =", user)

            if user is not None:
                refresh = RefreshToken.for_user(user)

                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                })

            return Response(
                {"error": "Invalid email or password"},
                status=401
            )

        print(serializer.errors)
        return Response(serializer.errors, status=400)


@extend_schema(
    summary="Logout User",
    description="Logout the currently authenticated user.",
    request=None,
    responses={
        200:None,
    }    
)
class LogoutView(APIView):
    def post(self, request):
        logout(request)    
        return Response({"message":"Logout successfully ............"})
                



class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUserModel.objects.filter(id=self.request.user.id)

    def get_object(self):
        return self.request.user