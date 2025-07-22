from channels.generic.websocket import AsyncWebsocketConsumer
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from .models import ChatGroup, GroupMessage
from django.contrib.auth import get_user_model
import json

User = get_user_model()

def get_members(chatgroup):
    return list(chatgroup.members.all())

class ChatroomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            print("[DEBUG] connect() called")
            self.user = self.scope['user']
            print(f"[DEBUG] self.user: {self.user} (type: {type(self.user)})")
            self.chatroom_name = self.scope['url_route']['kwargs']['chatroom_name']
            print(f"[DEBUG] chatroom_name: {self.chatroom_name}")
            self.chatroom = await database_sync_to_async(get_object_or_404)(ChatGroup, group_name=self.chatroom_name)
            print(f"[DEBUG] Chatroom loaded: {self.chatroom}")
            print(f"[CONNECT] Attempt by user: {self.user} (Authenticated: {getattr(self.user, 'is_authenticated', False)})")
            print(f"[CONNECT] Chatroom: {self.chatroom_name}, Private: {self.chatroom.is_private}")

            if self.chatroom.is_private:
                print("[DEBUG] Chatroom is private, checking membership...")
                members = await database_sync_to_async(get_members)(self.chatroom)
                print(f"[DEBUG] Members: {members}")
                if self.user not in members:
                    print(f"[CONNECT] Access denied: user {self.user} is not a member of private chatroom '{self.chatroom_name}'.")
                    await self.close()
                    return
                else:
                    print(f"[DEBUG] User {self.user} is a member of the chatroom.")

            await self.channel_layer.group_add(
                self.chatroom_name,
                self.channel_name
            )
            print(f"[DEBUG] Added to group: {self.chatroom_name}")

            await self.accept()
            print(f"[CONNECT] WebSocket connection accepted for user {self.user} in chatroom {self.chatroom_name}")
        except Exception as e:
            print(f"[EXCEPTION in connect()] {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            print(f"[DEBUG] disconnect() called for user {self.user} in chatroom {self.chatroom_name}")
            await self.channel_layer.group_discard(
                self.chatroom_name,
                self.channel_name
            )
            print(f"[DISCONNECT] User {self.user} disconnected from chatroom {self.chatroom_name}")
        except Exception as e:
            print(f"[EXCEPTION in disconnect()] {e}")

    async def receive(self, text_data):
        try:
            print(f"[DEBUG] receive() called with data: {text_data}")
            print(f"[DEBUG] self.user: {self.user} (Authenticated: {getattr(self.user, 'is_authenticated', False)})")
            data = json.loads(text_data)
            body = data.get('body')
            print(f"[DEBUG] Message body: {body}")

            if self.user.is_authenticated and body:
                message = await database_sync_to_async(GroupMessage.objects.create)(
                    body=body,
                    author=self.user,
                    group=self.chatroom
                )
                print(f"[RECEIVE] Saved message ID {message.id} from {self.user} in chatroom {self.chatroom_name}")

                await self.channel_layer.group_send(
                    self.chatroom_name,
                    {
                        'type': 'chat_message',
                        'message_id': message.id
                    }
                )
                print(f"[DEBUG] Sent group_send for message {message.id}")
            else:
                print(f"[DEBUG] User not authenticated or empty message body.")
        except Exception as e:
            print(f"[EXCEPTION in receive()] {e}")

    async def chat_message(self, event):
        try:
            print(f"[DEBUG] chat_message() called with event: {event}")
            message = await database_sync_to_async(GroupMessage.objects.get)(id=event['message_id'])
            print(f"[SEND] Sending message ID {message.id} to chatroom {self.chatroom_name}")
            await self.send(text_data=json.dumps({
                'type': 'chat.message',
                'message': {
                    'id': message.id,
                    'body': message.body,
                    'author': message.author.username,
                    'created_at': str(message.created_at),
                    'group': message.group.group_name
                }
            }))
            print(f"[DEBUG] Message sent to WebSocket: {message.id}")
        except Exception as e:
            print(f"[EXCEPTION in chat_message()] {e}")
