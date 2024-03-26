from rest_framework import serializers
from .models import ProjectSettings

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectSettings
        fields = '__all__'
