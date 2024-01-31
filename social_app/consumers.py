
# chat/consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import ChatMessage, ChatRoom
from django.contrib.auth.models import User
from user_app.models import CustomUser

class TextRoomConsumer(WebsocketConsumer):
    def connect(self):
        # gets 'room_name' and open websocket connection
        self.room_name = self.scope['url_route']['kwargs']['room_name'] #
        self.room_group_name = 'chat_%s' % self.room_name
        
        token = self.scope['url_route']['kwargs']['token']
        username = self.scope['url_route']['kwargs']['username']
        # temps = self.scope['headers']
        # for a, b in temps:
        #     if a.decode('utf-8') == 'token':
        #         token = b.decode('utf-8')
        #     if a.decode('utf-8') == 'username':
        #         username = b.decode('utf-8')
        user = CustomUser.objects.filter(username=username).first()
        
        user_token = str(user.auth_token)
        if token == user_token:                
            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
            
            # room_name = ChatRoom.objects.filter(room_name=self.room_name).first()
            # # Send last 20 messages to the client upon connection
            # last_messages = ChatMessage.objects.filter(room_name=room_name)
            # for message in reversed(last_messages):
            self.send(text_data=json.dumps({
                
                'is_Connected': "True",
                'sender': user.username
            }))
                
        else:
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()
            self.send(text_data=json.dumps({
                'is_Connected': "False.",
                'sender': user.username
            }))
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text = text_data_json['text']
        username = text_data_json['sender']
        
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': text,
                'sender': username
            }
        )
        
        # room_name = room_name = ChatRoom.objects.filter(room_name=self.room_name).first()        
        # user = CustomUser.objects.filter(username=username).first()
        # ChatMessage.objects.create(text=text, user=user, room_name=room_name)    

    
    def chat_message(self, event):
        # Receive message from room group
        text = event['message']
        sender = event['sender']

        # broadcast message to all clients in WebSocket
        self.send(text_data=json.dumps({
            'text': text,
            'sender': sender
        }))
