from rest_framework import serializers
from mainapp.models import LostAndFoundEntry, CustomUser, ComplaintEntry
import requests

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'profile_photo', 'name', 'surname', 'phone_number', 'description']


class CreateLostAndFoundEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'topic', 'description', 'upload_date', 'category']

#2 serializer da aynı oldu güncellemelerle ileride düzelt!!!!
class DefaultLostAndFoundEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date', 'category']

#user returns as object
class UserLostAndFoundEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = LostAndFoundEntry
        fields = ['id', 'user', 'topic', 'description', 'upload_date', 'category']


class DefaultComplaintEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = ComplaintEntry
        fields = ['id', 'topic', 'description', 'user', 'upload_date', 'vote', 'target_mail']


class ComplaintEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintEntry
        fields = ['id', 'topic', 'description', 'upload_date', 'vote', 'target_mail']


class CreateComplaintEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintEntry
        fields = ['id', 'topic', 'description', 'upload_date', 'target_mail']

    def validate_description(self, description):

        endpoint = "https://bilboard-contentmoderator.cognitiveservices.azure.com/"
        headers = {
            "Content-Type": "text/plain",
            "Ocp-Apim-Subscription-Key": "4042096c1951481d9859da0516043a96"
        }
        data = description.encode("utf-8")

        response = requests.post(endpoint + "contentmoderator/moderate/v1.0/ProcessText/Screen", headers=headers, data=data)
        
        if response.status_code == 200:
            result = response.json()
            if "Terms" in result:
                # Raise an error for inappropriate content
                raise serializers.ValidationError("Description contains inappropriate content.")
        else:
            raise serializers.ValidationError("Error while connecting to the content moderator service.")

        return description





