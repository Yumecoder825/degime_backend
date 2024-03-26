from django.urls import path
from .views import SettingsListCreateAPIView

urlpatterns = [
    path('settings/', SettingsListCreateAPIView.as_view(), name='settings-list-create'),
]

#add the below link in urls.py in Degime_backend

# urlpatterns = [
    # Other app URLs...
    #path('api/', include('settings_backend.urls')),
#]