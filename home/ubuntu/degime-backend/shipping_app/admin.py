from django.contrib import admin
from .models import ShippingOrder

@admin.register(ShippingOrder)
class ShippingOrderAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'status', 'is_shipped')
    list_filter = ('status', 'is_shipped')
    search_fields = ('tracking_number',)
