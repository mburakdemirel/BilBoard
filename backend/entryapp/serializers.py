from rest_framework import serializers
from mainapp.models import LostAndFoundEntry

class LostAndFoundEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date', 'category']