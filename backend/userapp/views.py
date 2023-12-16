import datetime
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth import get_user_model, logout
from .helpers import send_forget_password_mail

from rest_framework import generics
from userapp.serializers import (
    UserSerializer,
    DefaultUserSerializer,
    MyTokenObtainPairSerializer,
    EmailVerifySerializer,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from mainapp.models import CustomUser
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from productapp import serializers
from bilboard_backend.redis_config import get_redis_instance
from bilboard_backend.redis_config import cache
from mainapp.models import OnlineUserModel
redis_instance = get_redis_instance()


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system."""
    permission_classes = [AllowAny]
    serializer_class = UserSerializer # Serializer class that will be used for creating the user
    def create(self, request, *args, **kwargs):
        # First, let the serializer create the user
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            # Create Online User Model
            user = CustomUser.objects.get(email=request.data['email'])
            online_user_model = OnlineUserModel.objects.create(user=response.data['id'])
            # Send verification email
            # Change with a nice html template later on
            email_verification_token = jwt.encode({'user_id': user.id, 'email': user.email}, settings.SECRET_KEY, algorithm='HS256')
            # absolute_url = 'http://' + get_current_site(request).domain + reverse("user:verify_email") + f'?token={email_verification_token}'
            absolute_url = 'http://' + "127.0.0.1:3000" + "/login/" + f'?token={email_verification_token}'

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


class ManageUserView(generics.RetrieveUpdateDestroyAPIView):
    """Used for read-write-delete endpoints to represent a single model instance."""
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        cache.delete_pattern("laf_entries_*")
        cache.delete_pattern("complaint_entries_*")
        user = self.request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            print("\033[2;31;43m serializer.is_valid in views \033[0;0m")
            #get profile photo from request with name profile_photo
            file = request.FILES.get('profile_photo', None)
            if file:
                user.profile_photo = file

            old_password = request.data.get('old_password', None)
            new_password = request.data.get('new_password', None)
            if old_password and new_password:
                if user.check_password(old_password):
                    try:
                        validate_password(new_password, user)
                        user.set_password(new_password)
                    except ValidationError as e:
                        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'error': 'Wrong old password'}, status=status.HTTP_400_BAD_REQUEST)
            elif new_password and not old_password:
                return Response({'error': 'Please provide old password'}, status=status.HTTP_400_BAD_REQUEST)

            # Save the user with updated fields
            user.save()
            serializer.save()

            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = self.get_object()
        user.delete()

        #Üşenmezsen ürüne veya entry'e sahip olduğu yerlere göre cache key invalidate et
        cache.delete_pattern("secondhand_products_*")
        cache.delete_pattern("borrow_products_*")
        cache.delete_pattern("donation_products_*")
        cache.delete_pattern("laf_entries_*")
        cache.delete_pattern("complaint_entries_*")
        return Response(status=status.HTTP_204_NO_CONTENT)  # Return no content response with 204 status code

@api_view(['POST'])
def ChangePassword(request):
    if request.method == 'POST':
        token = request.GET.get('token')
        try:
            # Token'ı çözme
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = CustomUser.objects.get(id=payload['user_id'])
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.DecodeError:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        password = data.get('password')

        # Şifre doğrulaması
        try:
            validate_password(password, user)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if user.used_password_reset_token == token:
            return Response({'error': 'This link has already been used.'}, status=status.HTTP_400_BAD_REQUEST)

        user.used_password_reset_token = token
        user.set_password(password)
        user.save()
        return Response({'message': 'Password successfully updated.'}, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid request method.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def ForgetPassword(request):
    if request.method == 'POST':
        email = request.data.get('email')
        user = CustomUser.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'No user is associated with this email.'}, status=status.HTTP_404_NOT_FOUND)

        # Generate a JWT token
        expiration = datetime.datetime.now() + datetime.timedelta(hours=1)  # Token expires in 1 hour
        token = jwt.encode({'user_id': user.id, 'exp': expiration}, settings.SECRET_KEY, algorithm='HS256')

        # Send email
        reset_url = 'http://' + "127.0.0.1:3000" + "/change_password/" + f'?token={token}'

        send_forget_password_mail(user, reset_url)

        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid request method.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ListMyFavorites(request):
    user = CustomUser.objects.get(email=request.user)
    count = user.favorited_products.count()
    serializer = serializers.ProductSerializer(user.favorited_products, many=True)
    if count == 0:
        return Response({"message": "There are no favorited products of user", })
    else:
        return Response({"message": serializer.data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_photo(request):
    user = CustomUser.objects.get(email=request.user)
    #truthy falsy
    if user.profile_photo:
        user.profile_photo.delete()
        user.profile_photo = None
        user.save()
        cache.delete_pattern("laf_entries_*")
        cache.delete_pattern("complaint_entries_*")
        return Response({"message": "Profile photo deleted"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Profile photo does not exist"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request):
    user_id = request.data.get('user_id')
    user = CustomUser.objects.get(id=user_id)
    if user:
        serializer = DefaultUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User with specified id is not found."}, status=status.HTTP_404_NOT_FOUND)
