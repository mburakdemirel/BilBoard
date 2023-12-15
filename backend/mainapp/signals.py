import json

from django.db.models.signals import (
    pre_save,
    post_save,
    pre_delete,
)
from django.dispatch import receiver
from .models import (
    Product,
    LostAndFoundEntry,
    Chat,
    Message,
    Notification,
    OnlineUserModel,
)
from django.contrib.auth import get_user_model

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(pre_delete, sender=get_user_model(), dispatch_uid='delete_chats_of_user')
def delete_chats_of_user(sender, instance, **kwargs):
    # Test prints
    print('delete_chats_of_user')
    print(instance)

    chats = Chat.objects.filter(participiants__in=[instance])
    if chats:
        chats.delete()

@receiver(pre_delete, sender=Product, dispatch_uid='delete_chats_of_product')
def delete_chats_of_product(sender, instance, **kwargs):

    # Test prints
    print('delete_chats_of_product')
    print(instance)

    chats = Chat.objects.filter(product_id=instance.id, category=instance.category)
    if chats:
        chats.delete()

@receiver(pre_delete, sender=LostAndFoundEntry, dispatch_uid='delete_chats_of_entry')
def delete_chats_of_entry(sender, instance, **kwargs):

        # Test prints
        print('delete_chats_of_entry')
        print(instance)

        chats = Chat.objects.filter(product_id=instance.id, category=instance.category)
        if chats:
            chats.delete()

@receiver(pre_delete, sender=Chat, dispatch_uid='delete_messages_of_chat')
def delete_messages_of_chat(sender, instance, **kwargs):

        # Test prints
        print('delete_messages_of_chat')
        print(instance)

        messages = instance.messages.all()
        if messages:
            messages.delete()


# Notification signals
# @receiver(post_save, sender=Product, dispatch_uid='upvote_product')
# def product_upvoted_by_user(sender, instance, **kwargs):


# Message signals
# @receiver(post_save, sender=Chat, dispatch_uid='message_sent')
# def message_sent(sender, instance, created, **kwargs):
#     # get the authenticated user

#     if not created:
#         channel_layer = get_channel_layer()
#         group_name =

#         async_to_sync(channel_layer.group_send)

@receiver(pre_delete, sender=Message, dispatch_uid='message_sent')
def message_deleted(sender, instance, **kwargs):
    print('message_deleted')
    x = kwargs['signal']
    print(f'\033[1;34;40m{x}\033[0;0m') #test


@receiver(post_save, sender=Notification, dispatch_uid='notification_sent')
def send_notification(sender, instance, created, **kwargs):
    print(f'\033[1;31;40m NOTIFSIGNAL {created} \033[0;0m')
    if created:
        channel_layer = get_channel_layer()
        notification_obj = Notification.objects.filter(receiver=instance.receiver, is_read=False)
        notification_count = notification_obj.count()
        group_name = f"notification_{instance.receiver.id}"

        content = {
            "count": notification_count,
            "current_notification": {
                "id": instance.id,
                "title": instance.title,
                "description": instance.description,
                "timestamp": str(instance.timestamp),
                "is_read": instance.is_read,
                "related_item_id": instance.related_item_id,
                "related_item": instance.related_item,
            }
        }
        async_to_sync(channel_layer.group_send)(
             group_name, {
                "type": "send_notification",
                "value": json.dumps(content),
             }
        )
        print(f'\033[4;31;40m notification sent \033[0;0m') #test
    else:
        notification_obj = Notification.objects.filter(receiver=instance.receiver, is_read=False)
        notification_count = notification_obj.count()
        print(f'\033[1;31;40m Notification is updated, new count is {notification_count}\033[0;0m')


# user_prev_status = None

# @receiver(post_save, sender=get_user_model(), dispatch_uid='user_status_changed')
# def user_online_status_changed(sender, instance, created, **kwargs):


@receiver(post_save, sender=OnlineUserModel, dispatch_uid='user_status_changed')
def user_online_status_changed(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    group_name = f"online_{instance.user.id}"
    actual_user = instance.user

    user_status = 'online' if instance.is_online else 'offline'

    content = {
        "user_id": actual_user.id,
        "user_status": user_status,
    }

    print(f'\033[1;31;40m {user_status} \033[0;0m')

    async_to_sync(channel_layer.group_send)(
        group_name, {
            'type': 'send_status',
            'value': json.dumps(content),
        }
    )
    print(f'\033[1;31;40m user status changed \033[0;0m')