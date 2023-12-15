"""Serializers for the userapi"""

#Instead of referring to User directly, you should reference the user model using django.contrib.auth.get_user_model().
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
import requests
from django.core.files.base import ContentFile
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import AnalyzeImageOptions, ImageData

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object"""
    #Tell djangorest, the model, fields and extra args that we want to pass to serializer
    profile_photo = serializers.ImageField(required=False)
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'name', 'surname', 'password', 'is_verified', 'profile_photo', 'description', 'phone_number', 'favorited_products')
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
            'is_verified': {'read_only': True},
        }

    def validate_email(self, email):
        """Validate that the email is from Bilkent domain."""
        if not email.endswith("@bilkent.edu.tr") and not email.endswith("@ug.bilkent.edu.tr"):
            raise serializers.ValidationError("You must be a Bilkent member.")
        return email
    
    def validate_profile_photo(self, profile_photo):
        """Validate that the profile photo is appropriate."""
        endpoint = "https://bilboard-contentmoderator.cognitiveservices.azure.com/"
        headers = {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": "4042096c1951481d9859da0516043a96"
        }

        image_data = profile_photo.read()
        if profile_photo:

            response_face = requests.post(endpoint + "contentmoderator/moderate/v1.0/ProcessImage/FindFaces", headers=headers, data=image_data)
            if response_face.status_code == 200:
                result_face = response_face.json()
                if result_face['Count'] == 0:
                    raise serializers.ValidationError("Uploaded profile photo should contain a face.")
            else:
                raise serializers.ValidationError("Error on azure connection")

            client = ContentSafetyClient('https://bugbunnycontentsafety.cognitiveservices.azure.com', AzureKeyCredential('8edc66e999cf4d1093171f7e73558532'))
            request_safety = AnalyzeImageOptions(image=ImageData(content=image_data))
            response_safety = client.analyze_image(request_safety)

            hate = response_safety.get('categoriesAnalysis')[0].get('severity')
            self_harm = response_safety.get('categoriesAnalysis')[1].get('severity')
            sexual = response_safety.get('categoriesAnalysis')[2].get('severity')
            violence = response_safety.get('categoriesAnalysis')[3].get('severity')

            if hate !=0 or self_harm!=0 or sexual!=0 or violence!=0:
                raise serializers.ValidationError("Uploaded profile photo contains inappropriate content.")         


        return profile_photo

    #Override the create function to create a user with encrypted password, called after the successfull validation
    def create(self, validated_data):
        """Create a new user with encrypted password and return it."""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update a user if verified"""
        validated_data.pop('email', None)  # Emails are unique, so we can't update them
        password = validated_data.pop('password', None)
        super().update(instance, validated_data)
        return instance


class DefaultUserSerializer(serializers.ModelSerializer):
    """Serializer for the user object"""
    #Tell djangorest, the model, fields and extra args that we want to pass to serializer
    profile_photo = serializers.ImageField(required=False)
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'name', 'surname', 'profile_photo', 'description', 'phone_number')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer to include certain user information in the token response.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_verified:
            raise serializers.ValidationError('Account should be verified first.')
        data.update({
            'user_id': self.user.id,
            'email': self.user.email,
            'is_verified': self.user.is_verified,
        })
        return data


class EmailVerifySerializer(serializers.Serializer):
    token = serializers.CharField(max_length=555)
    class Meta:
        model = get_user_model()
        fields = ["token"]
