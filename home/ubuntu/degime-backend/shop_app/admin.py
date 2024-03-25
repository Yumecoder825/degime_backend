from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Product
# Import Token model and TokenAdmin from rest_framework.authtoken
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.admin import TokenAdmin

# Define the custom UserAdmin class
class UserAdmin(BaseUserAdmin):
    search_fields = ['username', 'email']  # Add fields you want to search for
# Register the User model with your custom UserAdmin
admin.site.register(User, UserAdmin)

# Define the ProductAdmin class
class ProductAdmin(admin.ModelAdmin):
    search_fields = ['product_code', 'product_name', 'description', 'is_new', 'is_recommended', 'stock']

# Register the Product model with ProductAdmin
admin.site.register(Product, ProductAdmin)

# Define the CustomTokenAdmin class
class CustomTokenAdmin(TokenAdmin):
    search_fields = ('user__username',)

# Unregister existing Token model



# Re-register Token model with the CustomTokenAdmin class
admin.site.register(Token, CustomTokenAdmin)

