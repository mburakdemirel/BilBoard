from rest_framework import serializers
from mainapp.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification objects."""
    class Meta:
        model = Notification
        fields = ('id', 'receiver', 'notification_type', 'title', 'description', 'timestamp', 'is_read', 'related_item_id', 'related_item')
        read_only_fields = ('id', 'receiver', 'notification_type', 'title', 'description', 'timestamp', 'is_read', 'related_item_id', 'related_item')