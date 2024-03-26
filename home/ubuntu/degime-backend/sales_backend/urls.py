from django.urls import path
from .views import SaleListCreateAPIView

urlpatterns = [
    path('sales/', SaleListCreateAPIView.as_view(), name='sale-list-create'),
   
]




# include this urls.py in Degime_backend

#urlpatterns = [
    # Other app URLs...
 #   path('api/', include('sales_backend.urls')),
#]