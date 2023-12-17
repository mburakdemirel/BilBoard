"""
URL configuration for notificationapp app.
"""

from django.urls import path
from .views import (
    UnreadNotificationsView,
)

urlpatterns = [
    path("notifications/unread/", UnreadNotificationsView.as_view(), name="unread-notifications" )
]