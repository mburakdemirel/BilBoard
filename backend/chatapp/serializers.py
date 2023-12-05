from rest_framework import serializers
from mainapp.models import Chat, Message

from django.contrib.auth import get_user_model

# class ParticipantSerializer(serializers.StringRelatedField):
#     def to_internal_value(self, value):
#         return value

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'author', 'content', 'timestamp')
        read_only_fields = ('id', 'author', 'content', 'timestamp')


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    class Meta:
        model = Chat
        fields = ('id', 'participiants', 'messages')
        read_only_fields = ('id',)


    def create(self, validated_data):
        current_user_id = self.context['request'].user.id
        participiants = validated_data.pop('participiants')
        validated_data.pop('messages')

        if len(participiants) != 1:
            raise serializers.ValidationError("Participant error")

        if current_user_id is participiants[0].id:
            raise serializers.ValidationError("User cannot create chat with himself")

        if not get_user_model().objects.filter(id=participiants[0].id).exists():
            raise serializers.ValidationError("User not found")

        possible_chat = Chat.objects.filter(participiants=current_user_id).filter(participiants__in=participiants).distinct()

        if possible_chat.exists():
            return possible_chat.first()
        else:
            chat = Chat.objects.create(**validated_data)
            chat.participiants.add(get_user_model().objects.get(id=current_user_id))
            chat.participiants.add(get_user_model().objects.get(id=participiants[0].id))
            return chat