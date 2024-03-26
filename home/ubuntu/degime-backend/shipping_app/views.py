from rest_framework import generics
from .models import ShippingOrder
from .serializers import ShippingOrderSerializer

class ShippingOrderListCreateAPIView(generics.ListCreateAPIView):
    queryset = ShippingOrder.objects.all()
    serializer_class = ShippingOrderSerializer
