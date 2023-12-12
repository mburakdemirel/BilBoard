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
)
from django.contrib.auth import get_user_model


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