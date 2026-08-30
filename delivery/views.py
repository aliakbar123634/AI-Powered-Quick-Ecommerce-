from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import DeliveryTracking
from .serializers import DeliveryTrackingSerializer

from accounts.models import RiderProfile

from notifications.models import Notification
from notifications.utils import send_email_notification


class DeliveryTrackingViewSet(viewsets.ModelViewSet):

    serializer_class = DeliveryTrackingSerializer

    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["order", "status"]

    def get_queryset(self):

        user = self.request.user

    # ==========================================
    # ADMIN
    # Admin needs access to delivery records
    # so that rider assignment can work.
    # ==========================================
        if user.role == "ADMIN" or user.is_staff or user.is_superuser:
            return DeliveryTracking.objects.all()

    # ==========================================
    # RIDER
    # Rider can only access his own deliveries
    # ==========================================
        if user.role == "RIDER":

            try:
                rider = user.rider_profile
            except RiderProfile.DoesNotExist:
               return DeliveryTracking.objects.none()

            return DeliveryTracking.objects.filter(
            order__rider=rider
        )

    # ==========================================
    # CUSTOMER
    # ==========================================
        return DeliveryTracking.objects.filter(
        order__user=user
    )

    def get_permissions(self):

        # Admin can assign rider
        if self.action == "assign":
            return [IsAdminUser()]

        # All other actions require authentication
        return [IsAuthenticated()]

    # =====================================================
    # ADMIN → ASSIGN
    # =====================================================

    @action(
        detail=True,
        methods=["patch"],
        url_path="assign"
    )
    def assign(self, request, pk=None):

        delivery = self.get_object()

        rider_id = request.data.get("rider")

        if not rider_id:
            return Response(
                {"error": "Rider id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            rider = RiderProfile.objects.get(
                id=rider_id
            )
        except RiderProfile.DoesNotExist:
            return Response(
                {"error": "Rider not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not rider.user.is_active:
            return Response(
                {"error": "Rider account is inactive"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not rider.availability_status:
            return Response(
                {"error": "Rider is not available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if delivery.order.rider_id:
            return Response(
                {
                    "error":
                    "A rider is already assigned to this order"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Only paid/confirmed order can be assigned
        if delivery.order.status != "CONFIRMED":
            return Response(
                {
                    "error":
                    "Order must be CONFIRMED before rider assignment"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.order.rider = rider
        delivery.order.save(
            update_fields=["rider"]
        )

        rider.availability_status = False
        rider.save(
            update_fields=["availability_status"]
        )

        delivery.status = DeliveryTracking.Status.ASSIGNED
        delivery.save(
            update_fields=["status"]
        )

        Notification.objects.create(
            user=delivery.order.user,
            title="Rider Assigned",
            message=(
                f"Rider has been assigned for "
                f"order {delivery.order.order_number}."
            )
        )

        send_email_notification(
            delivery.order.user.email,
            "Rider Assigned",
            f"""
Your order {delivery.order.order_number}
has been assigned to a rider.

Status: ASSIGNED
"""
        )

        serializer = self.get_serializer(delivery)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # =====================================================
    # RIDER → PICKED UP
    # =====================================================

    @action(
        detail=True,
        methods=["patch"],
        url_path="picked-up"
    )
    def picked_up(self, request, pk=None):

        try:
            rider = request.user.rider_profile
        except RiderProfile.DoesNotExist:
            return Response(
                {"error": "You are not a rider"},
                status=status.HTTP_403_FORBIDDEN
            )

        delivery = self.get_object()

        if delivery.order.rider_id != rider.id:
            return Response(
                {
                    "error":
                    "You are not assigned to this order"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if delivery.status != DeliveryTracking.Status.ASSIGNED:
            return Response(
                {
                    "error":
                    "Order must be ASSIGNED first"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.status = DeliveryTracking.Status.PICKED_UP
        delivery.save(
            update_fields=["status"]
        )

        Notification.objects.create(
            user=delivery.order.user,
            title="Order Picked Up",
            message=(
                f"Your order {delivery.order.order_number} "
                f"has been picked up."
            )
        )

        send_email_notification(
            delivery.order.user.email,
            "Order Picked Up",
            f"""
Your order {delivery.order.order_number}
has been picked up by the rider.
"""
        )

        serializer = self.get_serializer(delivery)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # =====================================================
    # RIDER → OUT FOR DELIVERY
    # =====================================================

    @action(
        detail=True,
        methods=["patch"],
        url_path="out-for-delivery"
    )
    def out_for_delivery(self, request, pk=None):

        try:
            rider = request.user.rider_profile
        except RiderProfile.DoesNotExist:
            return Response(
                {"error": "You are not a rider"},
                status=status.HTTP_403_FORBIDDEN
            )

        delivery = self.get_object()

        if delivery.order.rider_id != rider.id:
            return Response(
                {
                    "error":
                    "You are not assigned to this order"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if delivery.status != DeliveryTracking.Status.PICKED_UP:
            return Response(
                {
                    "error":
                    "Order must be PICKED_UP first"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.status = (
            DeliveryTracking.Status.OUT_FOR_DELIVERY
        )
        delivery.save(
            update_fields=["status"]
        )

        delivery.order.status = "OUT_FOR_DELIVERY"
        delivery.order.save(
            update_fields=["status"]
        )

        Notification.objects.create(
            user=delivery.order.user,
            title="Out For Delivery",
            message=(
                f"Your order {delivery.order.order_number} "
                f"is on the way."
            )
        )

        send_email_notification(
            delivery.order.user.email,
            "Out For Delivery",
            f"""
Good news!

Your order {delivery.order.order_number}
is out for delivery.
"""
        )

        serializer = self.get_serializer(delivery)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # =====================================================
    # RIDER → DELIVERED
    # =====================================================

    @action(
        detail=True,
        methods=["patch"],
        url_path="delivered"
    )
    def delivered(self, request, pk=None):

        try:
            rider = request.user.rider_profile
        except RiderProfile.DoesNotExist:
            return Response(
                {"error": "You are not a rider"},
                status=status.HTTP_403_FORBIDDEN
            )

        delivery = self.get_object()

        if delivery.order.rider_id != rider.id:
            return Response(
                {
                    "error":
                    "You are not assigned to this order"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if delivery.status != DeliveryTracking.Status.OUT_FOR_DELIVERY:
            return Response(
                {
                    "error":
                    "Order must be OUT_FOR_DELIVERY first"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.status = DeliveryTracking.Status.DELIVERED
        delivery.save(
            update_fields=["status"]
        )

        order = delivery.order

        order.status = "DELIVERED"
        order.save(
            update_fields=["status"]
        )

        # COD payment
        if hasattr(order, "payment"):

            payment = order.payment

            if payment.payment_method == "COD":

                payment.payment_status = "PAID"

                payment.save(
                    update_fields=["payment_status"]
                )

        # Rider becomes available again
        rider.availability_status = True
        rider.save(
            update_fields=["availability_status"]
        )

        Notification.objects.create(
            user=order.user,
            title="Order Delivered",
            message=(
                f"Order {order.order_number} "
                f"has been delivered successfully."
            )
        )

        send_email_notification(
            order.user.email,
            "Order Delivered",
            f"""
Congratulations!

Your order {order.order_number}
has been delivered successfully.

Thank you for shopping with us.
"""
        )

        serializer = self.get_serializer(delivery)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )