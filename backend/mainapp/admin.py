"""Django admin customization"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from mainapp import models


class UserAdmin(BaseUserAdmin):
    """Define the admin pages for users."""
    ordering = ['id']
    list_display = ['email', 'name', 'surname', 'id']
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

class ProductAdmin(admin.ModelAdmin):
    """Define the admin pages for products."""
    
    list_display = ('title', 'category', 'user')
    ordering = ['id']
    search_fields = ('title', 'category',)

    # Specify the list of fields to be used as filters in the admin list view
    list_filter = ('category', 'user')
    fieldsets = (
        (None, {'fields': ('title', 'description', 'product_photo', 'category', 'price', 'user',)}),
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


admin.site.register(models.CustomUser, UserAdmin)
admin.site.register(models.Product, ProductAdmin)

