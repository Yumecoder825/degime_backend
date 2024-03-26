from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from .mongodb_utils import connect_to_mongodb, close_mongodb_connection


class MongoDBQuerySet:
    def __init__(self, collection):
        self.collection = collection

    def all(self):
        return self.collection.find()


class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = MongoDBQuerySet(connect_to_mongodb()['your_collection_name'])
    serializer_class = ProductSerializer

    def get_queryset(self):
        collection = self.queryset.collection
        result = collection.find()
        close_mongodb_connection(collection.database.client)
        return result


class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MongoDBQuerySet(connect_to_mongodb()['your_collection_name'])
    serializer_class = ProductSerializer

    def get_queryset(self):
        collection = self.queryset.collection
        result = collection.find()
        close_mongodb_connection(collection.database.client)
        return result
