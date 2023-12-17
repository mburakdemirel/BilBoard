"""
Signals for models.
"""
import json

from django.db.models.signals import (
    post_save,
    pre_delete,
)
from django.dispatch import receiver
from .models import (
    Product,
    LostAndFoundEntry,
    Chat,
    Notification,
    OnlineUserModel,
)
from django.contrib.auth import get_user_model

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(pre_delete, sender=get_user_model(), dispatch_uid='delete_chats_of_user')
def delete_chats_of_user(sender, instance, **kwargs):
    """
    Deletes the bidirectional chats of the user that is deleted.
    """
    chats = Chat.objects.filter(participiants__in=[instance])
    if chats:
        chats.delete()

@receiver(pre_delete, sender=Product, dispatch_uid='delete_chats_of_product')
def delete_chats_of_product(sender, instance, **kwargs):
    """
    Deletes the bidirectional chats of the product that is deleted.
    """
    chats = Chat.objects.filter(product_id=instance.id, category=instance.category)
    if chats:
        chats.delete()

@receiver(pre_delete, sender=LostAndFoundEntry, dispatch_uid='delete_chats_of_entry')
def delete_chats_of_entry(sender, instance, **kwargs):
        """
        Deletes the bidirectional chats of the entry that is deleted.
        """
        chats = Chat.objects.filter(product_id=instance.id, category=instance.category)
        if chats:
            chats.delete()

@receiver(pre_delete, sender=Chat, dispatch_uid='delete_messages_of_chat')
def delete_messages_of_chat(sender, instance, **kwargs):
        """
        Deletes the messages of the chat that is deleted.
        """
        messages = instance.messages.all()
        if messages:
            messages.delete()

@receiver(post_save, sender=Notification, dispatch_uid='notification_sent')
def send_notification(sender, instance, created, **kwargs):
    """
    Sends notification to the receiver of the notification.
    """
    if created:
        channel_layer = get_channel_layer()
        notification_obj = Notification.objects.filter(receiver=instance.receiver, is_read=False)
        notification_count = notification_obj.count()
        group_name = f"notification_{instance.receiver.id}"

        content = {
            "id": instance.id,
            "title": instance.title,
            "description": instance.description,
            "timestamp": str(instance.timestamp),
            "related_item_id": instance.related_item_id,
            "related_item": instance.related_item,
        }
        async_to_sync(channel_layer.group_send)(
             group_name, {
                "type": "send_notification",
                "value": json.dumps(content),
             }
        )

@receiver(post_save, sender=OnlineUserModel, dispatch_uid='user_status_changed')
def user_online_status_changed(sender, instance, created, **kwargs):
    """
    Handles the online status of the user.
    """
    channel_layer = get_channel_layer()
    group_name = f"online_{instance.user.id}"
    actual_user = instance.user

    user_status = 'online' if instance.is_online else 'offline'

    content = {
        "user_id": actual_user.id,
        "user_status": user_status,
    }

    async_to_sync(channel_layer.group_send)(
        group_name, {
            'type': 'send_status',
            'value': json.dumps(content),
        }
    )
