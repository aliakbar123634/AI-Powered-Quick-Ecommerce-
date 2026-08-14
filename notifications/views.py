from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
# Create your views here.

class NotifictaionViewSet(viewsets.ModelViewSet):
    queryset=Notification.objects.all()
    serializer_class=NotificationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):

        return Notification.objects.filter(
            user=self.request.user
        )
    @action(detail=True, methods=["patch"])
    def mark_read(self,request,pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(
            {
                "message":
                "Notification marked as read"
            }
        )
