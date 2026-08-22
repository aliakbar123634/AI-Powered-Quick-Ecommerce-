from itertools import count
from django.shortcuts import render
from . models import CustomUserModel , Address
from .serializers import CustomUserSerializer , LoginSerializer , AddressSerializer , DeliveryCheckSerializer , ResetPasswordSerializer , ForgotPasswordSerializer , NewsletterSubscribeSerializer
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
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
import resend
from django.utils.http import urlsafe_base64_decode
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import password_validation



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


class ForgotPasswordView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = CustomUserModel.objects.get(
                email=email
            )
        except CustomUserModel.DoesNotExist:

            # Security reason:
            # Don't reveal whether email exists.
            return Response({
                "message": "If this email exists, a password reset link has been sent."
            })

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(
            user
        )

        reset_link = (
            f"{settings.FRONTEND_URL}"
            f"/reset-password/{uid}/{token}"
        )

        resend.api_key = settings.RESEND_API_KEY

        resend.Emails.send({
            "from": "QuickAI <onboarding@resend.dev>",
            "to": [user.email],
            "subject": "Reset your QuickAI password",
            "html": f"""
                <h2>Reset your password</h2>

                <p>
                    You requested to reset your QuickAI password.
                </p>

                <p>
                    Click the button below to create a new password:
                </p>

                <a href="{reset_link}"
                   style="
                   display:inline-block;
                   padding:12px 20px;
                   background:#00a63c;
                   color:white;
                   text-decoration:none;
                   border-radius:6px;
                   ">
                    Reset Password
                </a>

                <p>
                    If you did not request this, you can safely ignore
                    this email.
                </p>

                <p>
                    This link will expire when the password reset token
                    becomes invalid.
                </p>
            """
        })

        return Response({
            "message": "If this email exists, a password reset link has been sent."
        })


class ResetPasswordView(APIView):

    permission_classes = []

    def post(self, request):

        uid = request.data.get("uid")
        token = request.data.get("token")

        if not uid or not token:
            return Response(
                {"error": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = urlsafe_base64_decode(
                uid
            ).decode()

            user = CustomUserModel.objects.get(
                pk=user_id
            )

        except (
            TypeError,
            ValueError,
            OverflowError,
            CustomUserModel.DoesNotExist
        ):
            return Response(
                {"error": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(
            user,
            token
        ):
            return Response(
                {"error": "Reset link is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        password = serializer.validated_data["password"]

        user.set_password(password)
        user.save()

        return Response({
            "message": "Password reset successfully."
        })


class NewsletterSubscribeView(APIView):

    def post(self, request):

        serializer = NewsletterSubscribeSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        subscriber = serializer.save()

        return Response(
            {
                "message": "Successfully subscribed to newsletter.",
                "email": subscriber.email,
            },
            status=status.HTTP_201_CREATED,
        )    