import json

from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from mainapp.models import Message, Chat

class ChatConsumer(WebsocketConsumer):
    def load_messages(self, data):
        messages = Message.objects.order_by("timestamp").all()[:10]
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
        content = {
            "command": "new_message",
            "message": self.msg_to_json(message)
        }
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