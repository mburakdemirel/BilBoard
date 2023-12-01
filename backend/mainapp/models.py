from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth import get_user_model

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
    favorited_products = models.ManyToManyField(
        'Product', 
        related_name='favorited_by', 
        blank=True
    )
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
    #product photo kaldırıldı.
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    return_date = models.DateField(null=True, blank=True)
    product_type = models.CharField(max_length=30, blank=True, null=True)
    # Common fields for all products
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    REQUIRED_FIELDS = ['title', 'category']

    def _str_(self):
        return self.title
    

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='product_photos', on_delete=models.CASCADE)
    product_photos = models.ImageField(upload_to='product_photos/', blank=True, null=True)

    
class EntryBase(models.Model):
    """
    This model is used for Lost and Found entry, also it is a base for Complaint entry.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    description = models.TextField(blank=False)
    upload_date = models.DateField(auto_now=True)
    topic = models.CharField(max_length=100)

    REQUIRED_FIELDS = ['topic', 'description']

    def _str_(self):
        return self.topic + " from " + self.user
    

class LostAndFoundEntry(EntryBase):
    CATEGORY_CHOICES = [
        ('lost', 'Lost'),
        ('found', 'Found'),
    ]
    #null = True?
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    REQUIRED_FIELDS = ['category']

    def _str_(self):
        return super()._str_()


class ComplaintEntry(EntryBase):
    """
    Complaint entry is different from base entry, because it has additional upvote and downvote rates.
    """
    vote = models.DecimalField(max_digits=6, decimal_places=0,null=True, blank=True, default=0)

    def _str_(self):
        return super()._str_()


class Message(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.id +  " - " + self.timestamp.strftime("%d/%m/%Y, %H:%M:%S")

class Chat(models.Model):
    participiants = models.ManyToManyField(get_user_model(), related_name="chats")
    messages = models.ManyToManyField(Message, blank=True)

    def __str__(self):
        return '{}'.format(self.id)

    def get_messages(self):
        return self.messages.all()

    def get_participiants(self):
        return "\n".join([str(p) for p in self.participiants.all()])