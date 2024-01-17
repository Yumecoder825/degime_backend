from rest_framework import serializers
from social_app.models import OnlineBusinessCard, SNSTree
# from django.contrib.auth.models import User
from user_app.models import CustomUser

class OnlineBusinessCardSerializer(serializers.ModelSerializer):
     user = serializers.ReadOnlyField(source='user.username')
     
     class Meta:
        model = OnlineBusinessCard
        fields = '__all__'
        extra_kwargs = {
            'user': {'queryset': CustomUser.objects.all()}
        }
        
class SNSTreeSerializer(serializers.ModelSerializer):
     user = serializers.ReadOnlyField(source='user.username')
     
     class Meta:
        model = SNSTree
        fields = '__all__'
        extra_kwargs = {
            'user': {'queryset': CustomUser.objects.all()}
        }

    # def create(self, validated_data):
    #     user = self.context['request'].user
    #     validated_data['user'] = user
    #     return super().create(validated_data)