"""
Views for chatapp
"""
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Max
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView,
)

from mainapp.models import Chat
from .serializers import ChatSerializer, ChatListSerializer

def get_user_or_404(user_id):
    return get_object_or_404(get_user_model(), pk=user_id)

class ChatListView(ListAPIView):
    serializer_class = ChatListSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def get_queryset(self):
        queryset = None
        user_id = self.request.user.id
        if user_id is not None:
            actual_user = get_user_or_404(user_id)
            # Exclude chats that have no messages
            queryset = actual_user.chats.all().exclude(messages__isnull=True)
            # Order by last message timestamp
            queryset = queryset.annotate(last_message_timestamp=Max('messages__timestamp')).order_by('-last_message_timestamp')
        return queryset

class ChatDetailView(RetrieveAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def get_queryset(self):
        queryset = None
        user_id = self.request.user.id
        if user_id is not None:
            actual_user = get_user_or_404(user_id)
            queryset = actual_user.chats.all()
        return queryset

class ChatCreateView(CreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ChatUpdateView(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ChatDeleteView(DestroyAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def get_queryset(self):
        queryset = None
        user_id = self.request.user.id
        if user_id is not None:
            actual_user = get_user_or_404(user_id)
            queryset = actual_user.chats.all()
        return queryset
