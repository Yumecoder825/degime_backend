from .consumers import TextRoomConsumer
from django.urls.conf import re_path

websocket_urlpatterns = [
    re_path(r'^chat/(?P<room_name>[^/]+)/(?P<token>[^/]+)/(?P<username>[^/]+)$', TextRoomConsumer.as_asgi()),
]
