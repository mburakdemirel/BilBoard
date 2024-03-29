"""
Django admin customization
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from mainapp import models


class UserAdmin(BaseUserAdmin):
    """Define the admin pages for users."""
    ordering = ['id']
    list_display = ['email', 'name', 'surname', 'id', 'is_verified']
    #Specify the fields in our model that we want to be shown in the admin page
    fieldsets = (
        #None is title section
        (None , {'fields': ('email', 'name', 'profile_photo', 'surname', 'password')}),
        (
            _('Permissions'),
            {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified')}
        ),
        (_('Dates'), {'fields': ('last_login',)}),

    )
    readonly_fields = ['last_login']

    add_fieldsets = (
        None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'surname', 'profile_photo', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser',)
        }
    ),


class ProductImageInline(admin.TabularInline):
    model = models.ProductImage
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    """Define the admin pages for products."""

    list_display = ('title','id', 'category', 'user')
    ordering = ['id']
    search_fields = ('title', 'category',)
    inlines = [ProductImageInline]

    # Specify the list of fields to be used as filters in the admin list view
    list_filter = ('category', 'user')
    fieldsets = (
        (None, {'fields': ('title', 'description', 'category', 'price', 'user',)}),
        ('Advanced options', {
            'classes': ('collapse',),
            'fields': ('return_date',),
        }),
        (_('Dates'), {'fields': ('upload_date',)}),
    )
    readonly_fields = ['upload_date']
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('title', 'description', 'category', 'price', 'user'),
        }),
    )


class LostAndFoundEntryAdmin(admin.ModelAdmin):
    """Define the admin pages for LAF entries."""

    list_display = ('topic', 'id', 'upload_date' , 'user', 'category')
    ordering = ['id']
    search_fields = ('topic', 'upload_date',)

    # Specify the list of fields to be used as filters in the admin list view
    list_filter = ('topic', 'user')
    fieldsets = (
        (None, {'fields': ('topic', 'description', 'user', 'category')}),
        (_('Dates'), {'fields': ('upload_date',)}),
    )
    readonly_fields = ['upload_date']
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('topic', 'description', 'user', 'category'),
        }),
    )

class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participiants', 'category', 'product_id', 'number_of_messages')
    readonly_fields = ['id', 'category', 'product_id', 'participiants'] # add messages
    fieldsets = (
        (None, {'fields': ('id', 'participiants', 'category', 'product_id', 'messages')}),
    )

    def number_of_messages(self, obj):
        return obj.messages.count()

class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'get_timestamp', 'content')
    readonly_fields = ('id', 'timestamp',)

    def get_timestamp(self, obj):
        return obj.timestamp.strftime("%d/%m/%Y, %H:%M:%S")


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_receiver', 'notification_type', 'title', 'description', 'related_item_id', 'related_item','is_read')
    readonly_fields = ('id', 'receiver', 'notification_type', 'title', 'description', 'related_item_id', 'related_item', 'timestamp', 'is_read')

    def get_receiver(self, obj):
        return obj.receiver.email

class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'topic', 'description', 'user')


class OnlineUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_online')


admin.site.register(models.CustomUser, UserAdmin)
admin.site.register(models.Product, ProductAdmin)
admin.site.register(models.LostAndFoundEntry, LostAndFoundEntryAdmin)
admin.site.register(models.ComplaintEntry, ComplaintAdmin)
admin.site.register(models.Chat, ChatAdmin)
admin.site.register(models.Message, MessageAdmin)
admin.site.register(models.Notification, NotificationAdmin)
admin.site.register(models.OnlineUserModel, OnlineUserAdmin)
