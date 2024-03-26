from django.shortcuts import render

#from rest_framework import generics
from rest_framework import generics
from .models import Sale
from .serializers import SaleSerializer

class SaleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
