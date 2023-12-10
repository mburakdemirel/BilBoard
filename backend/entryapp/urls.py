"""
url mapping
"""

from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter
from entryapp import views
from entryapp.views import vote_up_complaint, vote_down_complaint, list_voted_complaints

router = DefaultRouter()
# /user/product/ diyip giderse daha güzel olur çünkü user özelinde göstercek ürünleri
router.register('user/laf-entry', views.UserLostAndFoundEntryViewSet)
router.register('entry/laf-entry', views.LostAndFoundEntryViewSet)
router.register('user/complaint-entry', views.UserComplaintEntryViewSet)
router.register('entry/complaint-entry', views.ComplaintEntryViewSet)

app_name = 'entryapp'

urlpatterns = [
    #api/user/laf-entry/<product_id>/ => retrieve => get
    #api/user/laf-entry/ => list => get
    #api/user/laf-entry/ => create => post
    #api/user/laf-entry/<product_id>/ => delete => delete

    #api/entry/laf-entry/ => list => get
    #api/entry/laf-entry/<product_id>/ => retrieve => get
    #api/entry/laf-entry?search=<keyword> => list => get

    #api/user/complaint-entry/ => list => get
    #api/user/complaint-entry/<complaint_id>/ => retrieve => get
    #api/user/complaint-entry/ => create => post
    #api/user/complaint-entry/<complaint_id>/ => delete => delete

    #api/entry/complaint-entry/ => list => get
    #api/entry/complaint-entry/<complaint_id>/ => retrieve => get
    #api/entry/complaint-entry?search=<keyword> => list => get

    path('', include(router.urls)),
    path('complaint/vote-up/', vote_up_complaint, name='vote-up'),
    path('complaint/vote-down/',vote_down_complaint , name='vote-down'),
    path('user/list-my-voted-complaints/', list_voted_complaints, name='list-my-voted-complaints')
]