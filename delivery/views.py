from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DeliveryTracking
from .serializers import DeliveryTrackingSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from notifications.models import Notification
from notifications.utils import send_email_notification
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
class DeliveryTrackingViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryTrackingSerializer
    permission_classes = [
        IsAuthenticated
    ]
    def get_queryset(self):
        return DeliveryTracking.objects.filter(
            order__user=self.request.user
        )
    filter_backends = [DjangoFilterBackend]

    filterset_fields = ["order", "status"]
    @action(detail=True, methods=["patch"], url_path="assign")
    def assign(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status != DeliveryTracking.Status.PENDING:
            return Response(
            {"error": "Delivery is already assigned"},
            status=status.HTTP_400_BAD_REQUEST
        )
        delivery.status = DeliveryTracking.Status.ASSIGNED
        delivery.save()

        Notification.objects.create(
            user=delivery.order.user,
            title="Rider Assigned",
            message=f"Rider has been assigned for order {delivery.order.order_number}."
    )

        send_email_notification(
            delivery.order.user.email,
            "Rider Assigned",
            f"""
    Your order {delivery.order.order_number} has been assigned to a rider.

    Status: ASSIGNED
    """
        )
        serializer = DeliveryTrackingSerializer(delivery)
        return Response(serializer.data)
    @action(detail=True, methods=["patch"], url_path="picked-up")
    def picked_up(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status != DeliveryTracking.Status.ASSIGNED:
            return Response(
            {"error": "Delivery must be assigned first"},
            status=status.HTTP_400_BAD_REQUEST
           )
        delivery.status = DeliveryTracking.Status.PICKED_UP
        delivery.save()
        Notification.objects.create(
            user=delivery.order.user,
            title="Order Picked Up",
            message=f"Your order {delivery.order.order_number} has been picked up."
        )
        send_email_notification(
            delivery.order.user.email,
            "Order Picked Up",
            f"""
        Your order {delivery.order.order_number} has been picked up by the rider.
        """
        )
        # serializer = self.get_serializer(delivery)
        serializer = DeliveryTrackingSerializer(delivery)
        return Response(serializer.data)
    @action(detail=True, methods=["patch"], url_path="out-for-delivery")
    def out_for_delivery(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status != DeliveryTracking.Status.PICKED_UP:
            return Response(
                {"error": "Order has not been picked up yet"},
                status=status.HTTP_400_BAD_REQUEST
            )
        delivery.status = DeliveryTracking.Status.OUT_FOR_DELIVERY
        delivery.save()
        Notification.objects.create(
            user=delivery.order.user,
            title="Out For Delivery",
            message=f"Your order {delivery.order.order_number} is on the way."
        )

        send_email_notification(
            delivery.order.user.email,
            "Out For Delivery",
            f"""
        Good news!

        Your order {delivery.order.order_number} is out for delivery.
    """
        )

        # serializer = self.get_serializer(delivery)
        serializer = DeliveryTrackingSerializer(delivery)
        return Response(serializer.data)
    @action(detail=True, methods=["patch"], url_path="delivered")
    def delivered(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status != DeliveryTracking.Status.OUT_FOR_DELIVERY:
            return Response(
                {"error": "Delivery is not out for delivery"},
                status=status.HTTP_400_BAD_REQUEST
            )
        delivery.status = DeliveryTracking.Status.DELIVERED
        delivery.save()
        order = delivery.order
        order.status = "DELIVERED"
        order.save()
        Notification.objects.create(
           user=order.user,
           title="Order Delivered",
            message=f"Order {order.order_number} has been delivered successfully."
        )
        send_email_notification(
            order.user.email,
            "Order Delivered",
            f"""
    Congratulations!

    Your order {order.order_number} has been delivered successfully.

    Thank you for shopping with us.
   """
    )

        # serializer = self.get_serializer(delivery)
        serializer = DeliveryTrackingSerializer(delivery)

        return Response(serializer.data)
