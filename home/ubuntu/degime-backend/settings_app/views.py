from rest_framework import generics
from .models import ProjectSettings
from .serializers import SettingsSerializer

class SettingsListCreateAPIView(generics.ListCreateAPIView):
    queryset = ProjectSettings.objects.all()
    serializer_class = SettingsSerializer
