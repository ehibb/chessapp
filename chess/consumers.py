import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Room
class ChessConsumer(WebsocketConsumer):


    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug']
        self.room_name = self.room_name.replace(' ', '-')
        self.room_group_name = 'chat_%s' % self.room_name
        self.room = Room.objects.get(name_slug=self.room_name)
        print(self.room.connected_users)
        self.room.connected_users += 1
        self.room.save(update_fields=['connected_users'])
        if (self.room.connected_users > 2):
            return self.close()
        else:

            print(self.room.connected_users)
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, self.channel_name
            )

            self.accept()

        if (self.room.connected_users == 2):
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {"type": "game_start"}
            )




    def disconnect(self, code):

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        self.room.connected_users -= 1
        self.room.save(update_fields=['connected_users'])

        print(self.room.connected_users)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        text_data_type = text_data_json["type"]
        message_to_send = {"type": text_data_type}
        if (text_data_type == "chat_message"):
            message_to_send["message"] = text_data_json["message"]
        elif (text_data_type == "chess_move"):
            move = text_data_json["move"]
            message_to_send["from"] = move["from"]
            message_to_send["to"] = move["to"]
            message_to_send["promotion"] = move["promotion"]
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, message_to_send
        )
    def chat_message(self, event):
        self.send(text_data=json.dumps({"type": event["type"], "message": event["message"]}))

    def chess_move(self, event):
        self.send(text_data=json.dumps({"type": event["type"], "from": event["from"], "to": event["to"], "promotion": event["promotion"]}))
    
    def game_start(self, event):
        self.send(text_data=json.dumps({"type": event["type"]}))







