from django.contrib import admin
from social_app.models import (
    OnlineBusinessCard, SNSTree, 
    ContactData, ContactGroup,
    ChatRoom, ChatMessage
    )

# Register your models here.
admin.site.register(OnlineBusinessCard)
admin.site.register(SNSTree)
admin.site.register(ContactGroup)
admin.site.register(ContactData)
admin.site.register(ChatRoom)
admin.site.register(ChatMessage)