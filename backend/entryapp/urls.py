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
router.register('user/laf_entry', views.UserLostAndFoundEntryViewSet)

app_name = 'entryapp'

urlpatterns = [
    #api/user/laf_entry/<product_id>/ => retrieve => get
    #api/user/laf_entry/ => list => get
    #api/user/laf_entry/ => create => post
    path('', include(router.urls)),
]