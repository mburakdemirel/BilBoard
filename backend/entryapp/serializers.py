from rest_framework import serializers
from mainapp.models import LostAndFoundEntry, CustomUser, ComplaintEntry
import requests
import detectlanguage


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

    def validate_description(self, description):
        if check_for_toxicity(description):
            raise serializers.ValidationError("Description includes inappropriate content.")
        detectlanguage.configuration.api_key = "ccb2449f11adf19c28cf8807d854b658"
        result = detectlanguage.detect(description)
        if result[0].get('language') != 'en': 
            raise serializers.ValidationError('Description must be in English.')
        return description



def check_for_toxicity(description):
    url = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyBx_JtJ4B1AxpRoIU0PUU_X6eXRcV7_gNM'
    data = {
        'comment': {'text': description},
        'languages': ['en'],
        'requestedAttributes': {'TOXICITY': {}}
    }
    response = requests.post(url, json=data)
    response_data = response.json()
    # Assuming a threshold of 0.7 for toxicity
    toxicity_score = response_data['attributeScores']['TOXICITY']['summaryScore']['value']
    return toxicity_score > 0.5

