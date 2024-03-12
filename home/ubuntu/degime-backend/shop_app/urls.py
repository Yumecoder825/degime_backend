from django.urls import path
from .views import (ProductView)

urlpatterns = [
    path('product', ProductView.as_view(), name='product'),
    # path('product/list', get_list, name='product_list'),
]