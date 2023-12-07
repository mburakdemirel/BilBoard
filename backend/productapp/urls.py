"""
url mapping
"""

from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter
from productapp import views
from productapp.views import get_products_by_user_id, add_favorites, remove_favorites

router = DefaultRouter()
# /user/product/ diyip giderse daha güzel olur çünkü user özelinde göstercek ürünleri
router.register('user/product', views.UserProductViewSet)
router.register('product/secondhand', views.SecondhandProductViewSet)
router.register('product/borrow', views.BorrowProductViewSet)
router.register('product/donation', views.DonationProductViewSet)
app_name = 'productapp'

urlpatterns = [
    #api/user/product/<product_id>/ => retrieve => get
    #api/user/product/ => list => get
    #api/user/product/ => create => post
    #api/product/secondhand/<product_id>/ => retrieve => get
    #api/user/product/secondhand/ => list => get
    #api/product/secondhand?search=<keyword> => list => get
    #api/product/borrow/<product_id>/ => retrieve => get
    #api/product/borrow/ => list => get
    #api/product/borrow?search=<keyword> => list => get
    #api/product/donation/<product_id>/ => retrieve => get
    #api/product/donation/ => list => get
    #api/product/donation?search=<keyword> => list => get
    #api/product/add-favorites/             !!!!!   product_id will be sent from body
    #api/product/remove-favorites/             !!!!!   product_id will be sent from body
    path('', include(router.urls)),
    path('products/by-id/', get_products_by_user_id, name='get-products-by-user-id'),
    path('product/add-favorites/', add_favorites, name='add-favorites'),
    path('product/remove-favorites/', remove_favorites, name='remove-favorites'),
    path('product/delete-product-photo/', views.delete_product_photo, name='delete_product_photo')
]