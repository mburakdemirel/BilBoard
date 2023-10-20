"""Django admin customization"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from mainapp import models


class UserAdmin(BaseUserAdmin):
    """Define the admin pages for users."""
    ordering = ['id']
    list_display = ['email', 'name', 'surname']
    #Specify the fields in our model that we want to be shown in the admin page
    fieldsets = (
        #None is title section
        (None , {'fields': ('email', 'name', 'surname', 'password')}),
        (
            _('Permissions'),
            {'fields': ('is_active', 'is_staff', 'is_superuser',)}
        ),
        (_('Dates'), {'fields': ('last_login',)}),

    )
    readonly_fields = ['last_login']
    
    add_fieldsets = (
        None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'surname', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser',)
        }
    ),

admin.site.register(models.CustomUser, UserAdmin)

