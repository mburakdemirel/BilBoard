"""Serializers for the userapi"""

#Instead of referring to User directly, you should reference the user model using django.contrib.auth.get_user_model().
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object"""

    #Tell djangorest, the model, fields and extra args that we want to pass to serializer
    class Meta:
        model = get_user_model()
        fields = ('email', 'name', 'surname',  'password', 'is_verified',)
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
            'is_verified': {'read_only': True},
        }

    def validate_email(self, email):
        """Validate that the email is from Bilkent domain."""
        if not email.endswith("@bilkent.edu.tr") and not email.endswith("@ug.bilkent.edu.tr"):
            raise serializers.ValidationError("You must be a Bilkent member.")
        return email

    #Override the create function to create a user with encrypted password, called after the successfull validation
    def create(self, validated_data):
        """Create a new user with encrypted password and return it."""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update a user if verified"""
        self.Meta.extra_kwargs['email'] = {'read_only': True}
        validated_data.pop('email', None)  # Emails are unique, so we can't update them
        password = validated_data.pop('password', None)
        super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance

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
