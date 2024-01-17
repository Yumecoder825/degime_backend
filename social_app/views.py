from rest_framework import generics, status
from social_app.models import OnlineBusinessCard, SNSTree
from social_app.serializers import OnlineBusinessCardSerializer, SNSTreeSerializer
from Degime_backend.mixins import AppAuthPermMixin
from django.contrib.auth.models import User
from user_app.models import CustomUser
from django.http import JsonResponse
from rest_framework.response import Response


class OnlineBusinessCardListAPIView(generics.ListAPIView):
    queryset = OnlineBusinessCard.objects.all()
    serializer_class = OnlineBusinessCardSerializer
    
    def get_queryset(self):
        queryset = OnlineBusinessCard.objects.all()
        username = self.request.query_params.get('username')
        url_name = self.request.query_params.get('url_name')
        
        if username:
            queryset = queryset.filter(user__username=username)
            return queryset    
        
        if url_name:
            queryset = queryset.filter(url_name=url_name)
            return queryset
        
        queryset = None
        return queryset
    
class SNSTreeListAPIView(generics.ListAPIView):
    queryset = SNSTree.objects.all()
    serializer_class = SNSTreeSerializer
    
    def get_queryset(self):
        queryset = SNSTree.objects.all()
        username = self.request.query_params.get('username')
        url_name = self.request.query_params.get('url_name')
        
        if username:
            queryset = queryset.filter(user__username=username)
            return queryset    
        
        if url_name:
            queryset = queryset.filter(url_name=url_name)
            return queryset
        
        queryset = None
        return queryset
    
class OnlineBusinessCardAPIView(AppAuthPermMixin, generics.GenericAPIView):
    queryset = OnlineBusinessCard.objects.all()    
    serializer_class = OnlineBusinessCardSerializer
        
    def get(self, request, *args, **kwargs):
        queryset = OnlineBusinessCard.objects.filter(user=request.user)
        
        if queryset.count() == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, *args, **kwargs):
        queryset = OnlineBusinessCard.objects.filter(user=request.user)
        
        if queryset.count() == 0:
            serializer = OnlineBusinessCardSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        serializer = OnlineBusinessCardSerializer(queryset.first(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        queryset = OnlineBusinessCard.objects.filter(user=request.user)
        
        if queryset.count() == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        queryset.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SNSTreeAPIView(AppAuthPermMixin, generics.GenericAPIView):
    queryset = SNSTree.objects.all()    
    serializer_class = SNSTreeSerializer
        
    def get(self, request, *args, **kwargs):
        queryset = SNSTree.objects.filter(user=request.user)
        
        if queryset.count() == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, *args, **kwargs):
        queryset = SNSTree.objects.filter(user=request.user)
        
        if queryset.count() == 0:
            serializer = SNSTreeSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        serializer = SNSTreeSerializer(queryset.first(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        queryset = SNSTree.objects.filter(user=request.user)
        
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        queryset.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
                        
class OnlineBusinessCardAdminAPIView(AppAuthPermMixin, generics.GenericAPIView):
    serializer_class = OnlineBusinessCardSerializer
    
    def get(self, request, *args, **kwargs):
        queryset = OnlineBusinessCard.objects.all()
        
        if not self.request.user.is_superuser:
            queryset = queryset.none()  # Return an empty queryset
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response(self.get_paginated_response(serializer.data), 
                            status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        queryset = OnlineBusinessCard.objects.all()        
        
        if not self.request.user.is_superuser:
            queryset = queryset.none()  # Return an empty queryset
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        queryset.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SNSTreeAdminAPIView(AppAuthPermMixin, generics.GenericAPIView):
    serializer_class = SNSTreeSerializer
    
    def get(self, request, *args, **kwargs):
        queryset = SNSTree.objects.all()
        
        if not self.request.user.is_superuser:
            queryset = queryset.none()  # Return an empty queryset
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response(self.get_paginated_response(serializer.data), 
                            status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        queryset = SNSTree.objects.all()        
        
        if not self.request.user.is_superuser:
            queryset = queryset.none()  # Return an empty queryset
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        queryset.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
        # username = request.GET.get('username')