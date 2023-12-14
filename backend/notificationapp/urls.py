from django.urls import path
from . import views

urlpatterns = [
    path("test/notification/", views.index, name="index"),
]