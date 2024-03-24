
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Product

# Register the User model first
admin.site.register(User, BaseUserAdmin)

class UserAdmin(BaseUserAdmin):
    search_fields = ['username', 'email']  # Add fields you want to search for

# Replace the default UserAdmin with your custom UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

class ProductAdmin(admin.ModelAdmin):
    search_fields = ['product_code', 'product_name', 'description', 'is_new' , 'is_recommended', 'stock']

admin.site.register(Product, ProductAdmin)
