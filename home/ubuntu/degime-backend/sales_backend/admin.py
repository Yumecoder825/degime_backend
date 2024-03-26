from django.contrib import admin
from .models import Sale

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('date_time', 'price',)
    search_fields = ('date_time',)
    list_filter = ('date_time',)