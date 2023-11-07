from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework import generics
from userapp.serializers import (
    UserSerializer,
    MyTokenObtainPairSerializer,
    EmailVerifySerializer,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from mainapp.models import CustomUser
from rest_framework import status, authentication, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

import jwt

from django.core.mail import send_mail


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system."""
    permission_classes = [AllowAny]
    serializer_class = UserSerializer # Serializer class that will be used for creating the user
    def create(self, request, *args, **kwargs):
        # First, let the serializer create the user
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            user = CustomUser.objects.get(email=request.data['email'])
                # Send verification email
            # Change with a nice html template later on
            email_verification_token = jwt.encode({'user_id': user.id, 'email': user.email}, settings.SECRET_KEY, algorithm='HS256')
            absolute_url = 'http://' + get_current_site(request).domain + reverse("user:verify_email") + f'?token={email_verification_token}'
            subject = 'Welcome to Bilboard!'
            message =   f'Hi {user.name},\n\n' \
                        f'Please click on the link below to verify your email address:\n\n' \
                        f'{absolute_url}\n\n' \
                        f'Best regards,\n' \
                        f'Bilboard team'

            send_mail(
                subject,
                message,
                from_email= settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )
            return Response(status=status.HTTP_201_CREATED)
        return response
#Git test
class VerifyEmailView(generics.GenericAPIView):
    """Email verification view"""
    serializer_class = EmailVerifySerializer
    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = get_user_model().objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()
                refresh = RefreshToken.for_user(user)
                res = {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            return Response(
                #res,
                {'email': 'Successfully activated'},
                status=status.HTTP_200_OK,
            )
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': 'Activation Expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.exceptions.DecodeError:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ManageUserView(generics.RetrieveUpdateAPIView):
    """Updates user"""
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
