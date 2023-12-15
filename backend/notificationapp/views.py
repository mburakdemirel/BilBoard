from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, "notifications/index.html")

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
)
from rest_framework.permissions import IsAuthenticated
from mainapp.models import Notification
from .serializers import NotificationSerializer


class UnreadNotificationsView(ListAPIView):
    """ListAPIView for unread notifications."""
    permission_classes = (IsAuthenticated,)
    serializer_class = NotificationSerializer

    def get_queryset(self):
        """Returns the queryset of unread notifications."""
        actual_user = self.request.user
        queryset = Notification.objects.filter(receiver=actual_user, is_read=False)
        return queryset