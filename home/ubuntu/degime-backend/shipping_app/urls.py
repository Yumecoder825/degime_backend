from django.urls import path
from .views import ShippingOrderListCreateAPIView

urlpatterns = [
    path('shipping/orders/', ShippingOrderListCreateAPIView.as_view(), name='shipping-order-list-create'),
]

#add this in urls.py in Degime_backend

#urlpatterns = [
    # Other app URLs...
 #   path('api/', include('shipping.urls')),
# ]