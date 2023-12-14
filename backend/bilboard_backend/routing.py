from django.urls import re_path, include
from channels.routing import URLRouter
from chatapp import routing as chat_routing
from notificationapp import routing as notification_routing

websocket_urlpatterns = [
    re_path('ws/chat/', URLRouter(chat_routing.websocket_urlpatterns)),
    re_path('ws/notification/', URLRouter(notification_routing.websocket_urlpatterns)),
]