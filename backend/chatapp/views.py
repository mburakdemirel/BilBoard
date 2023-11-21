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


class ChatListView(ListAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

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
