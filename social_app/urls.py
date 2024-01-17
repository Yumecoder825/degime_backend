from django.urls import path, include
from social_app.views import (
    OnlineBusinessCardListAPIView, SNSTreeListAPIView,
    OnlineBusinessCardAPIView, SNSTreeAPIView,
    OnlineBusinessCardAdminAPIView, SNSTreeAdminAPIView
    )

urlpatterns = [
    #   public  GET social data
    #   "public/.../?username=username1", 
    #   "public/.../?url_name=username1url"
    path('public/online/', OnlineBusinessCardListAPIView.as_view(), name='public-onlinecard'),
    path('public/snstree/', SNSTreeListAPIView.as_view(), name='public-snstree'),
    
    #   private admin  GET DELETE all social data
    path('private/online/all/', OnlineBusinessCardAdminAPIView.as_view(), name='admin-onlinecard'),
    path('private/snstree/all/', SNSTreeAdminAPIView.as_view(), name='admin-snstree'),
    
    #   private user GET PUT DELETE social data
    path('private/online/', OnlineBusinessCardAPIView.as_view(), name='private-onlinecard'),
    path('private/snstree/', SNSTreeAPIView.as_view(), name='private-snstree'),
    
]