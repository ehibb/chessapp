from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chess/(?P<slug>[-\w]+)/$", consumers.ChessConsumer.as_asgi()),
]
