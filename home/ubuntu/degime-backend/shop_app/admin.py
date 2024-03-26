
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Product

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

# Unregister any models you want to remove from the admin site
# In this case, you don't need to unregister the User model since you're using a custom UserAdmin
# admin.site.unregister(User)

