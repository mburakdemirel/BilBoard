"""
url mapping
"""

from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter
from entryapp import views

router = DefaultRouter()
# /user/product/ diyip giderse daha güzel olur çünkü user özelinde göstercek ürünleri
router.register('user/laf-entry', views.UserLostAndFoundEntryViewSet)
router.register('entry/laf-entry', views.LostEntryViewSet)

app_name = 'entryapp'

urlpatterns = [
    #api/user/laf-entry/<product_id>/ => retrieve => get
    #api/user/laf-entry/ => list => get
    #api/user/laf-entry/ => create => post
    #api/user/laf-entry/<product_id>/ => delete => delete
    #api/entry/laf-entry/ => list => get
    #api/entry/laf-entry/<product_id>/ => retrieve => get
    #api/entry/laf-entry?search=<keyword> => list => get
    path('', include(router.urls)),
]