# Generated by Django 5.2.4 on 2025-07-07 15:45

import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_alter_chatgroup_group_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatgroup',
            name='users_online',
        ),
        migrations.AlterField(
            model_name='chatgroup',
            name='group_name',
            field=models.CharField(default=shortuuid.main.ShortUUID.uuid, max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='chatgroup',
            name='is_private',
            field=models.BooleanField(default=True),
        ),
    ]
