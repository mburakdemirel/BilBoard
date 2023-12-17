"""
Chat consumer for handling real-time messaging.
"""

import json

from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from mainapp.models import (
    Message,
    Chat,
    Notification,
    OnlineUserModel,
)

from mainapp.utils import notification_fields, NotificationType

class ChatConsumer(WebsocketConsumer):
    notificationBoolean = True
    def load_messages(self, data):
        chat = Chat.objects.get(id=data["chat_id"])
        messages = chat.messages.all().order_by("timestamp")[:15]
        content = {
            "command": "messages",
            "messages": self.msgs_to_json(messages)
        }
        self.send_message(content)

    def new_message(self, data):
        author_user = get_user_model().objects.get(id=data["author"])
        chat = Chat.objects.get(id=data["chat_id"])
        message = Message.objects.create(
            author=author_user,
            content=data["message"],
        )
        chat.messages.add(message)
        chat.save()
        contact = chat.participiants.exclude(id=author_user.id).first()
        contact_online = OnlineUserModel.objects.get(user__id=contact.id)
        content = {
            "command": "new_message",
            "message": self.msg_to_json(message)
        }

        print(f'\033[1;33;40m User:{author_user.email} selfNotificationBoolean: {self.notificationBoolean} Other: {contact_online.is_online}\033[0;0m')
        if(self.notificationBoolean and not contact_online.is_online):
            notification_header = notification_fields(
                notification_type=NotificationType.NEW_MESSAGE,
                category=chat.category,
                contact_name=author_user.name + ' ' + author_user.surname,
                realted_item_id=chat.id,
            )
            notification = Notification.objects.create(
                receiver = contact,
                notification_type = notification_header['notification_type'],
                title = notification_header['title'],
                description = notification_header['description'],
                related_item_id = notification_header['related_item_id'],
                related_item = notification_header['related_item'],
            )
            self.notificationBoolean = False
        else:
            print(f'\033[1;36;40m User:{author_user.email} Boolean: {self.notificationBoolean} Other: {contact.email}\033[0;0m')
        return self.send_chat_message(content)

    commands = {
        "load_messages": load_messages,
        "new_message": new_message,
    }

    def msgs_to_json(self,messages):
        return [self.msg_to_json(message) for message in messages]

    def msg_to_json(self, message):
        content = {
            "author": message.author.id,
            "content": message.content,
            "timestamp": str(message.timestamp),
        }
        return content

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
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

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self,data)

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    def send_message(self, content):
        self.send(text_data=json.dumps(content))

    def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))


class OnlineStatusConsumer(WebsocketConsumer):
    """Consumer for checking online status of users."""
    def change_status(self, data):
        print(f'\033[1;34;40mCHANGESTATUS{data}\033[0;0m')
        # actual_user = get_user_model().objects.get(id=data["user_id"])
        actual_user = OnlineUserModel.objects.get(user__id=data["user_id"])
        if(data["connection"] == 'open'):
            actual_user.is_online = True
            actual_user.save()
        else:
            actual_user.is_online = False
            actual_user.save()

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f'online_{self.room_name}'
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        # Disconnect from room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.change_status(data)

    def send_status(self, event):
        data = json.loads(event['value'])
        user_id = data['user_id']
        user_status = data['user_status']
        self.send(text_data=json.dumps({"user_id": user_id, "user_status": user_status}))