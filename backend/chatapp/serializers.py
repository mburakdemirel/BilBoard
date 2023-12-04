from rest_framework import serializers
from mainapp.models import Chat

from django.contrib.auth import get_user_model

class ParticipantSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value

class ChatSerializer(serializers.ModelSerializer):
    participiants = ParticipantSerializer(many=True)
    class Meta:
        model = Chat
        fields = ('id', 'participiants', 'messages')
        read_only_fields = ('id',)

    def create(self, validated_data):
        participiants = validated_data.pop('participiants')
        chat = Chat.objects.create(**validated_data)
        for participiant in participiants:
            user = get_user_model().objects.get(email=participiant)
            chat.participiants.add(user)
        return chat
