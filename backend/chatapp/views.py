# for testing purposes
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils.safestring import mark_safe
import json

def index(request):
    return render(request, "chat/index.html")

def room(request, room_name):
    payload = {
        "room_name": mark_safe(json.dumps(room_name)),
        "author": request.user,
    }
    return render(request, "chat/room.html", payload)





# actual code
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
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
            queryset = actual_user.chats.all()
            last_message_timestamps = []
            for i in queryset:
                if i.get_messages().count() > 0:
                    last_message_timestamps.append((i.get_messages().order_by('-timestamp').first().timestamp, i))
                else:
                    last_message_timestamps.append((None, i))
            last_message_timestamps.sort(key=lambda x: (x[0] is None, x[0]), reverse=True)
            queryset = [i[1] for i in last_message_timestamps]
            queryset.reverse()
        return queryset

class ChatDetailView(RetrieveAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)
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
    permission_classes = (permissions.AllowAny,)

class ChatUpdateView(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

class ChatDeleteView(DestroyAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        queryset = None
        user_id = self.request.user.id
        if user_id is not None:
            actual_user = get_user_or_404(user_id)
            queryset = actual_user.chats.all()
        return queryset
