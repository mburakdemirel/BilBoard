import json

from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            self.close()
            return
        self.room_name = self.scope["user"].id
        self.room_group_name = f"notification_{self.room_name}"

        # TEST PRINTS
        print(f'\033[1;34;40m{self.room_group_name}\033[0;0m')
        print(f'\033[1;34;40m{self.scope["url_route"]}\033[0;0m')
        print(f'\033[1;34;40m{self.scope["url_route"]["kwargs"]}\033[0;0m')

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        pass

    def send_notification(self, event):
        print(f'\033[4;31;40m {event} \033[0;0m')
        data = json.loads(event["value"])
        count = data["count"]
        self.send(text_data=json.dumps({"count": count}))
