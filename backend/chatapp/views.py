# # chat/views.py
# from django.shortcuts import render
# from django.contrib.auth.decorators import login_required
# from django.utils.safestring import mark_safe
# import json

# def index(request):
#     return render(request, "chat/index.html")

# @login_required
# def room(request, room_name):
#     payload = {
#         "room_name": mark_safe(json.dumps(room_name)),
#         "author": request.user,
#     }
#     return render(request, "chat/room.html", payload)

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
from .serializers import ChatSerializer

def get_user_or_404(user_id):
    return get_object_or_404(get_user_model(), pk=user_id)

class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = None
        user_id = self.request.query_params.get("user_id", None)
        if user_id is not None and user_id.isdigit():
            actual_user = get_user_or_404(user_id)
            queryset = actual_user.chats.all()
        return queryset

class ChatDetailView(RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

class ChatCreateView(CreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

class ChatUpdateView(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

class ChatDeleteView(DestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)
