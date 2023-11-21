# # chat/urls.py
# from django.urls import path

# from . import views


# urlpatterns = [
#     path("", views.index, name="index"),
#     path("<str:room_name>/", views.room, name="room"),
# ]

from django.urls import path
from .views import (
    ChatListView,
    ChatDetailView,
    ChatCreateView,
    ChatUpdateView,
    ChatDeleteView,
)

app_name = "chat"

urlpatterns = [
    path('', ChatListView.as_view(), name='chat-list'),
    path('create/', ChatCreateView.as_view(), name='chat-create'),
    path('<pk>/', ChatDetailView.as_view(), name='chat-detail'),
    path('<pk>/update/', ChatUpdateView.as_view(), name='chat-update'),
    path('<pk>/delete/', ChatDeleteView.as_view(), name='chat-delete'),
]
