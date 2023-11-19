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
# /user/product/ diyip giderse daha güzel olur çünkü user özelinde göstercek ürünleri
router.register('product', views.ProductViewSet)

app_name = 'productapp'

urlpatterns = [
    #api/user/product/<product_id>/ => retrieve
    #api/user/product/ => list
    path('user/', include(router.urls)),
    path('', include(router.urls)),
]