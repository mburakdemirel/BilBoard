from rest_framework import serializers
from mainapp.models import LostAndFoundEntry, CustomUser, ComplaintEntry

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'profile_photo', 'name', 'surname', 'phone_number', 'description']


class CreateLostAndFoundEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'topic', 'description', 'upload_date']

#2 serializer da aynı oldu güncellemelerle ileride düzelt!!!!
class DefaultLostAndFoundEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date']

#user returns as object
class UserLostAndFoundEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date']


class DefaultComplaintEntrySerializer(serializers.ModelSerializer):
    """
    liste olarak görünümde description göstermeyen serializer
    """
    user = UserSerializer(read_only=True)
    class Meta:
        model = ComplaintEntry
        fields = ['id', 'topic', 'description', 'user', 'upload_date', 'vote', 'target_mail']


"""class ComplaintEntrySerializer(serializers.ModelSerializer):
    
    üzerinde tiklayinca description gösteren serializer
    
    # user döndürmedik, çünkü sikayetler anonim olsun. Complaint checker check edicek.
    class Meta:
        model = ComplaintEntry
        fields = ['id', 'topic', 'description', 'upload_date', 'vote', 'target_mail']"""


class CreateComplaintEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintEntry
        fields = ['id', 'topic', 'description', 'upload_date', 'target_mail']