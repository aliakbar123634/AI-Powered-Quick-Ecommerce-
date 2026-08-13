from itertools import count
from django.shortcuts import render
from . models import CustomUserModel , Address
from .serializers import CustomUserSerializer , LoginSerializer , AddressSerializer , DeliveryCheckSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate , login , logout
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomUserModel
from .serializers import ProfileSerializer
from rest_framework.decorators import action
from .utils.distance import calculate_distance
from rest_framework.exceptions import ValidationError



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
    
@extend_schema_view(

    list=extend_schema(
        summary="Get User Addresses",
        description="Retrieve all addresses belonging to the authenticated user.",
        tags=["Addresses"],
    ),

    retrieve=extend_schema(
        summary="Get Address Details",
        description="Retrieve a single address by its ID.",
        tags=["Addresses"],
    ),

    create=extend_schema(
        summary="Create Address",
        description="Create a new address for the authenticated user.",
        request=AddressSerializer,
        responses=AddressSerializer,
        tags=["Addresses"],
    ),

    update=extend_schema(
        summary="Update Address",
        description="Update all fields of an existing address.",
        request=AddressSerializer,
        responses=AddressSerializer,
        tags=["Addresses"],
    ),

    partial_update=extend_schema(
        summary="Partially Update Address",
        description="Update specific fields of an existing address.",
        request=AddressSerializer,
        responses=AddressSerializer,
        tags=["Addresses"],
    ),

    destroy=extend_schema(
        summary="Delete Address",
        description="Delete an address owned by the authenticated user.",
        tags=["Addresses"],
    ),

)

class AddressViewSet(viewsets.ModelViewSet):

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):

        return Address.objects.filter(
            user=self.request.user
        )


    def perform_create(self, serializer):
        count = Address.objects.filter(
        user=self.request.user
        ).count()

        if count >= 5:
           raise ValidationError(
            "Maximum 5 addresses allowed"
        )

        serializer.save(
            user=self.request.user
        )


    @action(
        detail=True,
        methods=["patch"],
        url_path="set-default"
    )
    def set_default(self, request, pk=None):

        address = self.get_object()


        # remove old default address
        Address.objects.filter(
            user=request.user
        ).update(
            is_default=False
        )


        # set new default address
        address.is_default = True

        address.save()


        return Response(
            {
                "message": "Default address updated successfully",
                "address_id": address.id
            },
            status=status.HTTP_200_OK
        )
    

class DeliveryCheckAPIView(APIView):

    permission_classes = [IsAuthenticated]

    STORE_LATITUDE = 29.395600
    STORE_LONGITUDE = 71.683600

    MAX_DELIVERY_DISTANCE = 10  # KM

    def post(self, request):

        serializer = DeliveryCheckSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        latitude = serializer.validated_data["latitude"]
        longitude = serializer.validated_data["longitude"]

        distance = calculate_distance(
            self.STORE_LATITUDE,
            self.STORE_LONGITUDE,
            latitude,
            longitude,
        )

        available = distance <= self.MAX_DELIVERY_DISTANCE

        if available:
            eta = f"{int(distance * 5 + 15)} Minutes"
        else:
            eta = None

        return Response(
            {
                "delivery_available": available,
                "distance_km": distance,
                "estimated_delivery_time": eta,
            },
            status=status.HTTP_200_OK,
        )    