from django.db import models
from user_app.models import CustomUser


class OnlineBusinessCard(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    
    url_name = models.CharField(max_length=50, unique=True, blank=False) 
    faceImg = models.URLField(blank=True, default='')
    realName = models.CharField(max_length=50, blank=True, default='')
    profile = models.CharField(max_length=100, blank=True, default='')
    companyName = models.CharField(max_length=100, blank=True, default='')
    position = models.CharField(max_length=100, blank=True, default='')
    phoneNumber = models.CharField(max_length=50, blank=True, default='')
    mobilePhoneNumber = models.CharField(max_length=50, blank=True, default='')
    address = models.CharField(max_length=255, blank=True, default='')
    
    onlineCard_Data = models.JSONField(blank=True, default=dict)
    
class SNSTree(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    
    url_name = models.CharField(max_length=50, unique=True, blank=False) 
    faceImg = models.CharField(max_length=255, blank=True, default='') 
    accountName = models.CharField(max_length=50, blank=True, default='')
    profile = models.CharField(max_length=100, blank=True, default='')
    
    snsTree_Data = models.JSONField(blank=True, default=dict)