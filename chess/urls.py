from django.urls import path
from .views import front, room, room_detail
app_name = 'chess'

urlpatterns = [
    path('', front, name="front"),
    path('rooms/', room, name="room"),
    path('rooms/<int:pk>/', room_detail, name="detail"),
]
