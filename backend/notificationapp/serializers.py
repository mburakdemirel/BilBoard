from rest_framework import serializers
from mainapp.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification objects."""
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    class Meta:
        model = Notification
        fields = ('id', 'title', 'description', 'timestamp', 'related_item_id', 'related_item')
        read_only_fields = ('id', 'title', 'description', 'timestamp', 'related_item_id', 'related_item')