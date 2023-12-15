from django.urls import re_path
from .consumers import (
    ChatConsumer,
    OnlineStatusConsumer,
)

websocket_urlpatterns = [
       re_path(r'(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
       re_path(r'status/(?P<room_name>\w+)/$', OnlineStatusConsumer.as_asgi()),
]