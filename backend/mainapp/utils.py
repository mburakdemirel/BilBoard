"""
Utiliy functions for the bilboard web app.
"""
import enum
from mainapp.models import (
    Product,
    LostAndFoundEntry,
    ComplaintEntry,
)

class NotificationType(enum.Enum):
    NEW_MESSAGE = 'new_message'
    UPVOTE = 'upvoted_complaint'
    DOWNVOTE = 'downvoted_complaint'


def notification_fields(notification_type: NotificationType, category, **kwargs):
    if notification_type == NotificationType.NEW_MESSAGE:
        product = None
        if category in ['Secondhand', 'Borrow', 'Donation']:
            product = Product.objects.get(id=kwargs.get('realted_item_id'))
        elif category in ['Lost', 'Found']:
            product = LostAndFoundEntry.objects.get(id=kwargs.get('realted_item_id'))

        return {
            'notification_type': NotificationType.NEW_MESSAGE.value,
            'title': product.title,
            'description': f'You have a new message for {product.title} from {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('realted_item_id'),
            'related_item': 'CHAT',
        }
    elif notification_type == NotificationType.UPVOTE:
        complaint = ComplaintEntry.objects.get(id=kwargs.get('realted_item_id'))
        return {
            'notification_type': NotificationType.UPVOTE.value,
            'title': complaint.topic,
            'description': f'Your complaint {kwargs.get("complaint_name")} has been upvoted by {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('realted_item_id'),
            'related_item': 'COMPLAINT',
        }
    elif notification_type == NotificationType.DOWNVOTE:
        complaint = ComplaintEntry.objects.get(id=kwargs.get('realted_item_id'))
        return {
            'notification_type': NotificationType.DOWNVOTE.value,
            'title': complaint.topic,
            'description': f'Your complaint {kwargs.get("complaint_name")} has been downvoted by {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('realted_item_id'),
            'related_item': 'COMPLAINT',
        }
