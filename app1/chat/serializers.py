from rest_framework import serializers
from .models import GroupMessage, ChatGroup
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# ✅ Fix: Define UserSerializer
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']



class GroupMessageSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    group = serializers.SlugRelatedField(slug_field='group_name', queryset=ChatGroup.objects.all())

    class Meta:
        model = GroupMessage
        fields = ['id', 'body', 'author', 'created_at', 'group']

class ChatGroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    users_online = UserSerializer(many=True, read_only=True)

    class Meta:
        model = ChatGroup
        fields = ['id', 'group_name', 'is_private', 'members', 'users_online']
