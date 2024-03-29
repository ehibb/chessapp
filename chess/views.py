from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoomSerializer
from .models import Room
from django.shortcuts import render

# Create your views here.

def index(request):
    context = {}
    return render(request, "index.html", context)

@api_view(['GET', 'POST'])
def room(request):

    if request.method == 'GET':
        room = Room.objects.all()
        serializer = RoomSerializer(room, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def room_detail(request, room_slug):
    try:
        room = Room.objects.get(name_slug=room_slug)
    except Room.delete:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RoomSerializer(room, many=False)
        return Response(serializer.data)

    if request.method == 'DELETE':
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
