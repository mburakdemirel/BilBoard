from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)
from userapp.views import (
    CreateUserView,
    MyTokenObtainPairView,
    VerifyEmailView,
    ManageUserView,
)

app_name = 'user'

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    #Authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', VerifyEmailView.as_view(), name='verify_email'),
    path('me/', ManageUserView.as_view(), name='me'),
]