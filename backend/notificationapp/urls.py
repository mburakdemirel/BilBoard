from django.urls import path
from .views import (
    index,
    UnreadNotificationsView,
)

urlpatterns = [
    path("test/notification/", index, name="index"), #test
    path("notifications/unread/", UnreadNotificationsView.as_view(), name="unread-notifications" )
]