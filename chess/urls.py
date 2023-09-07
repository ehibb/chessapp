from django.urls import path
from .views import index, room, room_detail
app_name = 'chess'

urlpatterns = [
    path('', index, name="index"),
    path('rooms/', room, name="room"),
    path('rooms/<int:pk>/', room_detail, name="detail"),
]
