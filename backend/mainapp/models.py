from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, surname, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must set the email field')
        if not name:
            raise ValueError('Users must set the name field')
        if not surname:
            raise ValueError('Users must set the surname field')
        
        email = self.normalize_email(email)
        username = email.split('@')[0]
        user = self.model(email=email, username=username, name=name, surname=surname, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, surname, password, **extra_fields):

        email = self.normalize_email(email)
        username = email.split('@')[0]
        user = self.model(email=email, name=name, surname=surname, username=username, password=password, **extra_fields)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True

        user.save(using=self._db)
        return user

        


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name="email", max_length=100, unique=True)
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)

    username = models.CharField(max_length=80, unique=True)
    rate_ratio = models.FloatField(verbose_name="user rate", default=0.0)
    #profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    description = models.TextField(verbose_name="information about user", blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    # 'products' will be added after product module created !
    # 'message id list' will be discussed later since there are multiple approaches to keep messages. -> ForeignKey
    # same for notifications.

    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)


    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'surname']

    def str(self) -> str:
        return self.email