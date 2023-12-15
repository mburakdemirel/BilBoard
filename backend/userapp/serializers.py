"""Serializers for the userapi"""

#Instead of referring to User directly, you should reference the user model using django.contrib.auth.get_user_model().
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
import requests
from django.core.files.base import ContentFile
from mainapp.helpers import validate_email, validate_profile_photo

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object"""
    profile_photo = serializers.ImageField(required=False)
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'name', 'surname', 'password', 'is_verified', 'profile_photo', 'description', 'phone_number', 'favorited_products')
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
            'is_verified': {'read_only': True},
        }

    def validate(self, data):
        if data.get('email') is not None:
            validate_email(data.get('email'))
        if data.get('profile_photo') is not None:
            validate_profile_photo(data.get('profile_photo'))
        return data

    #Override the create function to create a user with encrypted password, called after the successfull validation
    def create(self, validated_data):
        """Create a new user with encrypted password and return it."""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update a user if verified"""
        validated_data.pop('email', None)  # Emails are unique, so we can't update them
        validated_data.pop('password', None)
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
