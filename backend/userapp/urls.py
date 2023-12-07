from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)
from userapp.views import (
    CreateUserView,
    MyTokenObtainPairView,
    VerifyEmailView,
    ManageUserView,
    ForgetPassword,
    ChangePassword,
    ListMyFavorites,
    delete_profile_photo
)

app_name = 'user'

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    #Authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', VerifyEmailView.as_view(), name='verify_email'),
    path('me/', ManageUserView.as_view(), name='me'),
    path('forget-password/' ,ForgetPassword , name="forget_password"),
    path('change-password/' , ChangePassword , name="change_password"),
    path('my-favorites/', ListMyFavorites, name='my_favorites'),
    path('delete-profile-photo/', delete_profile_photo, name='delete_profile_photo'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)