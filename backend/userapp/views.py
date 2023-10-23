from rest_framework import generics
from userapp.serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from mainapp.models import CustomUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system."""
    permission_classes = [AllowAny]
    serializer_class = UserSerializer # Serializer class that will be used for creating the user
    def create(self, request, *args, **kwargs):
        # First, let the serializer create the user
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            user = CustomUser.objects.get(email=request.data['email'])
            refresh = RefreshToken.for_user(user)

            res = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            return Response(res, status=status.HTTP_201_CREATED)
        return response


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
