from rest_framework import serializers
from mainapp.models import LostAndFoundEntry

#User'ı object olarak döndürmüyor gerekir mi diye düşün ve gerekiyorsa ekle
class LostAndFoundEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date', 'category']