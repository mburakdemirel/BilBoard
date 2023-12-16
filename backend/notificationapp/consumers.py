import json

from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from mainapp.models import Notification

class NotificationConsumer(WebsocketConsumer):
    def handle_unseen_notification(self, data):
        user = get_user_model().objects.get(id=data["user_id"])
        unseen_notifications = Notification.objects.filter(receiver=user, is_read=False)
        unseen_notifications.update(is_read=True)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "handle_unseen",
                "message": {
                    "command":"marked"
                }
            }
        )
        read_notifications = Notification.objects.filter(receiver=user, is_read=True)
        read_notifications.delete()
        # self.send(text_data=json.dumps({"command":"marked"}))

    def handle_single_unseen_notification(self, data):
        user = get_user_model().objects.get(id=data["user_id"])
        unseen_notification = Notification.objects.get(id=data["notification_id"])
        unseen_notification.is_read = True
        unseen_notification.save()
        unseen_notification.delete()
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type":"handle_unseen",
                "message":{
                    "command":"single_marked",
                    "notification_id":data["notification_id"]
                }
            }
        )

    def get_notification_count(self, data):
        user = get_user_model().objects.get(id=data["user_id"])
        counter = Notification.objects.filter(receiver=user, is_read=False).count()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type":"handle_count", "message":{"command":"first_get", "count": counter}}
        )
        # self.send(text_data=({"command":"first_get", "count": counter}))


    commands = {
        "mark_all": handle_unseen_notification,
        "mark_single": handle_single_unseen_notification,
        "counter": get_notification_count,
    }

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["user_id"]
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
        data = json.loads(text_data)
        self.commands[data["command"]](self, data)

    def send_notification(self, event):
        print(f'\033[4;31;40m {event} \033[0;0m')
        data = json.loads(event["value"])
        self.send(text_data=json.dumps(data))

    def handle_unseen(self, event):
        data = event['message']
        self.send(text_data=json.dumps(data))

    def handle_count(self, event):
        data = event['message']
        self.send(text_data=json.dumps(data))



