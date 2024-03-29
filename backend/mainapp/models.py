from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth import get_user_model
from django.db.models.signals import pre_delete
from django.dispatch import receiver

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
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
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


class OnlineUserModel(models.Model):
    """
    This model is used for determining whether a user is online or not in the chat.
    """
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        primary_key=True,
    )
    is_online = models.BooleanField(default=False)


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('secondhand', 'Secondhand'),
        ('borrow', 'Borrow'),
        ('donation', 'Donation'),
    ]

    TYPE_CHOICES = [
        ('electronics', 'Electronics'),
        ('book', 'Book'),
        ('household', 'Household'),
        ('clothing_accessories', 'Clothing & Accessories'),
        ('toys_games', 'Toys & Games'),
        ('sports', 'Sports'),
        ('art', 'Art'),
        ('other', 'Other')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    upload_date = models.DateField(auto_now=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    return_date = models.DateField(null=True, blank=True)
    product_type = models.CharField(max_length=30, default='other', choices=TYPE_CHOICES)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    REQUIRED_FIELDS = ['title', 'category', 'product_type']

    def _str_(self):
        return self.title


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_photos/', blank=True, null=True)


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
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, blank=False)

    def _str_(self):
        return super()._str_()


class ComplaintEntry(EntryBase):
    """
    Complaint entry is different from base entry, because it has additional upvote and downvote rates.
    """
    vote = models.DecimalField(max_digits=6, decimal_places=0,null=True, blank=True, default=0)
    target_mail = models.EmailField(verbose_name="target mail", max_length=100, blank=True, null=True)
    upvoted_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='upvoted_complaints',
        blank=True
    )
    downvoted_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='downvoted_complaints',
        blank=True
    )

    def _str_(self):
        return super()._str_()


class Message(models.Model):
    """
    Default message model for chat.
    """
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.author.id) +  " - " + self.timestamp.strftime("%d/%m/%Y, %H:%M:%S") + "-" + self.content + "\n"

class Chat(models.Model):
    """
    Chat model of the application.
    """
    CATEGORY_CHOICES = [
        ('secondhand', 'Secondhand'),
        ('borrow', 'Borrow'),
        ('donation', 'Donation'),
        ('lost', 'Lost'),
        ('found', 'Found'),
    ]

    participiants = models.ManyToManyField(get_user_model(), related_name="chats")
    messages = models.ManyToManyField(Message, blank=True)
    product_id = models.IntegerField(blank=False, null=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, null=True, blank=False)

    REQUIRED_FIELDS = ['participiants', 'product_id', 'category']

    def __str__(self):
        return '{}'.format(self.id)

    def get_messages(self):
        return self.messages.all()

    def get_last_message_timestamp(self):
        if self.messages.count() > 0:
            return self.messages.order_by('-timestamp').first().timestamp
        else:
            return None

    def get_participiants(self):
        return "\n".join([str(p) for p in self.participiants.all()])


class Notification(models.Model):
    """
    Notification model used for push notifications.
    """
    NOTIFICATION_CHOICES = [
        ('new_message', 'New Message'),
        ('upvoted_complaint', 'Upvoted Complaint'),
        ('downvoted_complaint', 'Downvoted Complaint'),
    ]

    # PRODUCT and LOSTFOUND are provided for future use
    ITEM_CHOICES = [
        ('PRODUCT', 'Product'),
        ('COMPLAINT', 'ComplaintEntry'),
        ('LOSTFOUND', 'LostAndFoundEntry'),
        ('CHAT', 'Chat'),
    ]

    receiver = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    notification_type = models.CharField(max_length=100, choices=NOTIFICATION_CHOICES)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    related_item_id = models.IntegerField()
    related_item = models.CharField(max_length=100, choices=ITEM_CHOICES)

    REQUIRED_FIELDS = ['receiver', 'type', 'title', 'description', 'related_item_id']

    def _str_(self) -> str:
        return self.receiver.email + ",\n" + self.notification_type + ",\n" + self.title + ",\n" + self.description + ",\n" + self.timestamp.strftime("%d/%m/%Y, %H:%M:%S") + ",\n" + str(self.is_read) + ",\n" + str(self.related_item_id) + ",\n" + str(self.related_item)

