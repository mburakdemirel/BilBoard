from rest_framework import serializers
from mainapp.models import LostAndFoundEntry, CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'surname', 'profile_photo', 'rate_ratio', 'description', 'phone_number']

#user olmamalı yeni serializer yarattım o yüzden
class CreateLostAndFoundEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'topic', 'description', 'upload_date', 'category']

#user returns with id
class DefaultLostAndFoundEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date', 'category']

#user returns as object
class UserLostAndFoundEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date', 'category']