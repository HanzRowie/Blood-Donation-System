from django.db import models
import shortuuid
from django.conf import settings
# Create your models here.

class ChatGroup(models.Model):
    group_name = models.CharField(max_length=100, unique=True, default=shortuuid.uuid)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_groups', blank=True)
    is_private = models.BooleanField(default=True)  # Always private now

    def __str__(self):
        return self.group_name
    

class  GroupMessage(models.Model):
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name='chat_messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.author.username} - {self.body}"
    class Meta:
        ordering = ['-created_at']