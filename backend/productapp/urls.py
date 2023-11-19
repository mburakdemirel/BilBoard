"""
url mapping
"""

from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter
from productapp import views

router = DefaultRouter()
router.register('product', views.ProductViewSet)

app_name = 'productapp'

urlpatterns = [
    path('', include (router.urls) ),
]