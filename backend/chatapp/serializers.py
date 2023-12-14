from rest_framework import serializers
from mainapp.models import Chat, Message
from django.contrib.auth import get_user_model
from mainapp.models import Product, LostAndFoundEntry, ProductImage

class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    class Meta:
        model = Message
        fields = ('id', 'author', 'content', 'timestamp')
        read_only_fields = ('id', 'author', 'content', 'timestamp')


class ChatListSerializer(serializers.ModelSerializer):
    participiants = serializers.StringRelatedField(many=True)
    product_name = serializers.StringRelatedField(read_only=True)
    image_url = serializers.StringRelatedField(read_only=True)
    last_message_timestamp = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Chat
        fields = ('id', 'participiants', 'category', 'product_id', 'product_name', 'image_url', 'last_message_timestamp')
        read_only_fields = ('id', 'participiants')

    def to_representation(self, instance):
        user = self.context['request'].user
        participiants = instance.participiants.all()
        contact = participiants.exclude(id=user.id).distinct()
        representation = super().to_representation(instance)
        representation['participiants'] = {
            "contact_id": contact.first().id,
            "contact_name": contact.first().name,
            "contact_surname": contact.first().surname,
        }
        category = instance.category
        product_id = instance.product_id
        if category in ['secondhand', 'borrow', 'donation']:
            product = Product.objects.get(id=product_id)
            representation['product_name'] = product.title
            product_images = ProductImage.objects.filter(product=product)
            if product_images.exists():
                representation['image_url'] = self.context['request'].build_absolute_uri(product_images.first().image.url)
            else:
                representation['image_url'] = None
            print(f'\033[1;34;40m{product_images}\033[0;0m') #test
        elif category in ['lost', 'found']:
            entry = LostAndFoundEntry.objects.get(id=product_id)
            representation['product_name'] = entry.topic
            representation['image_url'] = None

        last_message = instance.messages.order_by('-timestamp').first()
        # format timestamp to string representation of datetime
        representation['last_message_timestamp'] = last_message.timestamp.strftime("%d/%m/%Y, %H:%M:%S") if last_message is not None else None



        return representation

class ChatSerializer(serializers.ModelSerializer):
    CATEGORY_CHOICES = [
        ('secondhand', 'Secondhand'),
        ('borrow', 'Borrow'),
        ('donation', 'Donation'),
        ('lost', 'Lost'),
        ('found', 'Found'),
    ]

    messages = serializers.SerializerMethodField(read_only=True)
    product_name = serializers.StringRelatedField(read_only=True)
    image_url = serializers.StringRelatedField(read_only=True)
    contact = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'participiants', 'messages', 'category', 'product_id', 'product_name', 'image_url', 'contact')
        read_only_fields = ('id',)

    def get_messages(self, instance):
        messages = instance.messages.order_by('-timestamp').all()
        serializer = MessageSerializer(messages, many=True, read_only=True)
        return serializer.data

    def validate(self, attrs):
        current_user_id = self.context['request'].user.id
        if len(attrs.get('participiants')) != 1:
            raise serializers.ValidationError("Participant error")
        reciever_id = attrs.get('participiants')[0].id
        if current_user_id is reciever_id:
            raise serializers.ValidationError("User cannot create chat with himself")
        if not get_user_model().objects.filter(id=reciever_id).exists():
            raise serializers.ValidationError("User not found")

        category = attrs.get('category')
        product_id = attrs.get('product_id')

        if category is None:
            raise serializers.ValidationError("Category is required")
        if product_id is None:
            raise serializers.ValidationError("Product id is required")
        if category not in ['secondhand', 'borrow', 'donation', 'lost', 'found']:
            raise serializers.ValidationError("Category is not valid")

        if category in ['secondhand', 'borrow', 'donation']:
            if not Product.objects.filter(id=product_id).exists():
                raise serializers.ValidationError("Product not found")
            product = Product.objects.get(id=product_id)
            if product.category != category:
                raise serializers.ValidationError("Category is not valid")
            if product.user.id not in [current_user_id, reciever_id]:
                raise serializers.ValidationError("Unrelated product")
        elif category in ['lost', 'found']:
            if not LostAndFoundEntry.objects.filter(id=product_id).exists():
                raise serializers.ValidationError("Entry not found")
            entry = LostAndFoundEntry.objects.get(id=product_id)
            if entry.category != category:
                raise serializers.ValidationError("Category is not valid")
            if entry.user.id not in [current_user_id, reciever_id]:
                raise serializers.ValidationError("Unrelated entry")

        return attrs

    def to_representation(self, instance):
        user = self.context['request'].user
        participiants = instance.participiants.all()
        contact = participiants.exclude(id=user.id).distinct()
        representation = super().to_representation(instance)
        representation['contact'] = {
            "contact_id": contact.first().id,
            "contact_name": contact.first().name,
            "contact_surname": contact.first().surname,
        }

        category = instance.category
        product_id = instance.product_id
        if category in ['secondhand', 'borrow', 'donation']:
            product = Product.objects.get(id=product_id)
            representation['product_name'] = product.title
            product_images = ProductImage.objects.filter(product=product)
            print(f'\033[1;34;40m{product_images}\033[0;0m') #test
            if product_images.exists():
                representation['image_url'] = self.context['request'].build_absolute_uri(product_images.first().image.url)
            else:
                representation['image_url'] = None
        elif category in ['lost', 'found']:
            entry = LostAndFoundEntry.objects.get(id=product_id)
            representation['product_name'] = entry.topic
            representation['image_url'] = None
        return representation


    def create(self, validated_data):
        current_user_id = self.context['request'].user.id
        participiants = validated_data.pop('participiants')

        possible_chat = Chat.objects.filter(participiants=current_user_id).filter(participiants__in=participiants).filter(category=validated_data.get('category')).filter(product_id=validated_data.get('product_id'))

        if possible_chat.exists():
            return possible_chat.first()
        else:
            chat = Chat.objects.create(**validated_data)
            chat.participiants.add(get_user_model().objects.get(id=current_user_id))
            chat.participiants.add(get_user_model().objects.get(id=participiants[0].id))
            return chat