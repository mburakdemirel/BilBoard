"""
Utiliy functions for the bilboard web app.
"""
import enum

class NotificationType(enum.Enum):
    NEW_MESSAGE = 'new_message'
    UPVOTE = 'upvoted_complaint'
    DOWNVOTE = 'downvoted_complaint'


def notification_fields(notification_type: NotificationType, **kwargs):
    if notification_type == NotificationType.NEW_MESSAGE:
        return {
            'notification_type': NotificationType.NEW_MESSAGE.value,
            'title': 'New Message',
            'description': f'You have a new message from {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('realted_item_id'),
            'related_item': 'CHAT',
        }
    elif notification_type == NotificationType.UPVOTE:
        return {
            'notification_type': NotificationType.UPVOTE.value,
            'title': 'Upvoted Complaint',
            'description': f'Your complaint {kwargs.get("complaint_name")} has been upvoted by {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('realted_item_id'),
            'related_item': 'COMPLAINT',
        }
    elif notification_type == NotificationType.DOWNVOTE:
        return {
            'notification_type': NotificationType.DOWNVOTE.value,
            'title': 'Downvoted Complaint',
            'description': f'Your complaint {kwargs.get("complaint_name")} has been downvoted by {kwargs.get("contact_name")}',
            'related_item_id': kwargs.get('realted_item_id'),
            'related_item': 'COMPLAINT',
        }
