from django.db import models
from django.conf import settings
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
        
        #Applies NFKC Unicode normalization to usernames so that visually identical characters with different
        #Unicode code points are considered identical
        #username = self.model.normalize_username(username)

        user = self.model(email=email, name=name, surname=surname, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, surname, password, **extra_fields):
        user = self.create_user(email, name, surname, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True

        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name="email", max_length=100, unique=True)
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    rate_ratio = models.FloatField(verbose_name="user rate", default=0.0)
    profile_photo = models.ImageField(upload_to='pphotos/', blank=True, null=True)
    description = models.TextField(verbose_name="information about user", blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    used_password_reset_token = models.CharField(max_length=300, blank=True, null=True)

    # 'products' will be added after product module created !
    # 'message id list' will be discussed later since there are multiple approaches to keep messages. -> ForeignKey
    # same for notifications.

    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'surname']

    def __str__(self) -> str:
        return self.email
    
class Product(models.Model):
    CATEGORY_CHOICES = [
        ('secondhand', 'Secondhand'),
        ('borrow', 'Borrow'),
        ('donation', 'Donation'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    upload_date = models.DateField(auto_now=True) #bu ilerde içi silinecek ve daytime ile yüklendiği an
    # create product view de set edilecek. 
    product_photo = models.ImageField(upload_to='pphotos/', blank=True, null=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    return_date = models.DateField(null=True, blank=True)
    product_type = models.CharField(max_length=30, blank=True, null=True)
    # Common fields for all products
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True) 

    REQUIRED_FIELDS = ['title', 'category']

    def _str_(self):
        return self.title