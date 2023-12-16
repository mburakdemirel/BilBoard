"""
Utiliy functions for the bilboard web app.
"""
import enum
from mainapp.models import (
    Product,
    LostAndFoundEntry,
    ComplaintEntry,
    Chat,
)

class NotificationType(enum.Enum):
    NEW_MESSAGE = 'new_message'
    UPVOTE = 'upvoted_complaint'
    DOWNVOTE = 'downvoted_complaint'


def notification_fields(notification_type: NotificationType, category, **kwargs):
    if notification_type == NotificationType.NEW_MESSAGE:
        id_of_product = Chat.objects.get(id=kwargs.get('realted_item_id')).product_id
        product = None
        if category in ['secondhand', 'borrow', 'donation']:
            product = Product.objects.get(id=id_of_product)
        elif category in ['lost', 'found']:
            product = LostAndFoundEntry.objects.get(id=id_of_product)

        return {
            'notification_type': NotificationType.NEW_MESSAGE.value,
            'title': product.title,
            'description': f'You have a new message for {product.title} from {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('realted_item_id'),
            'related_item': 'CHAT',
        }
    elif notification_type == NotificationType.UPVOTE:
        complaint = ComplaintEntry.objects.get(id=kwargs.get('related_item_id'))
        return {
            'notification_type': NotificationType.UPVOTE.value,
            'title': complaint.topic,
            'description': f'Your complaint {kwargs.get("complaint_name")} has been upvoted by {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('related_item_id'),
            'related_item': 'COMPLAINT',
        }
    elif notification_type == NotificationType.DOWNVOTE:
        complaint = ComplaintEntry.objects.get(id=kwargs.get('related_item_id'))
        return {
            'notification_type': NotificationType.DOWNVOTE.value,
            'title': complaint.topic,
            'description': f'Your complaint {kwargs.get("complaint_name")} has been downvoted by {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('related_item_id'),
            'related_item': 'COMPLAINT',
        }
