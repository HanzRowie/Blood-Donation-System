from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Count

from .models import ChatGroup, GroupMessage
from .serializers import (
    GroupMessageSerializer,
    ChatGroupSerializer,
)
from django.shortcuts import render

# Create your views here.

@api_view(['GET'])
def get_current_user(request):
    if request.user.is_authenticated:
        return Response({'username': request.user.username})
    return Response({'detail': 'Not authenticated'}, status=401)
def chat_test_view(request):
    return render(request, 'chat_test.html')

def signup_page(request):
    return render(request, 'signup.html')

def login_page(request):
    return render(request, 'login.html')

@api_view(['GET'])
def get_chat_messages(request, chatroom_name):
    group = get_object_or_404(ChatGroup, group_name=chatroom_name)

    if group.is_private and request.user not in group.members.all():
        return Response({'detail': 'Not allowed'}, status=403)

    messages = group.chat_messages.all().order_by('-created_at')[:30]
    serializer = GroupMessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])

def send_message(request, chatroom_name):
    group = get_object_or_404(ChatGroup, group_name=chatroom_name)

    if group.is_private and request.user not in group.members.all():
        return Response({'detail': 'Not allowed'}, status=403)

    serializer = GroupMessageSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.save(author=request.user, group=group)
        return Response(GroupMessageSerializer(message).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_or_create_private_chatroom(request, username):
    User = get_user_model()
    if request.user.username == username:
        return Response({'detail': "Cannot create a private chat with yourself."}, status=400)

    try:
        other_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

    # Find all private chatrooms with both users as members and exactly two members
    chatrooms = (
        ChatGroup.objects
        .filter(is_private=True)
        .annotate(num_members=Count('members'))
        .filter(num_members=2)
        .filter(members=request.user)
        .filter(members=other_user)
    )

    # Now filter in Python to ensure ONLY these two users are members
    chatroom = None
    for group in chatrooms:
        member_ids = set(group.members.values_list('id', flat=True))
        if member_ids == {request.user.id, other_user.id}:
            chatroom = group
            break

    if not chatroom:
        chatroom = ChatGroup.objects.create(
            group_name=get_random_string(12),
            is_private=True
        )
        chatroom.members.set([request.user, other_user])  # Ensure ONLY these two users are members

    return Response({'group_name': chatroom.group_name})










# @api_view(['POST'])
# def get_or_create_private_chatroom(request, username):
#     try:
#         user = request.user
#         if not user.is_authenticated:
#             user = User.objects.get(username='superuser')  # default user for testing
#     except User.DoesNotExist:
#         return Response({'detail': 'Default user not found'}, status=404)

#     if user.username == username:
#         return Response({'detail': "Cannot create a private chat with yourself."}, status=400)

#     try:
#         other_user = User.objects.get(username=username)
#     except User.DoesNotExist:
#         return Response({'detail': 'User not found'}, status=404)

#     chatroom = (
#         ChatGroup.objects
#         .filter(is_private=True, members=user)
#         .filter(members=other_user)
#         .first()
#     )

#     if not chatroom:
#         chatroom = ChatGroup.objects.create(
#             group_name=get_random_string(12),
#             is_private=True
#         )
#         chatroom.members.add(user, other_user)

#     return Response({'group_name': chatroom.group_name})
