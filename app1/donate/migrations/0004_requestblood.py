# Generated by Django 5.1.4 on 2025-02-14 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donate', '0003_alter_donateblood_date_of_birth'),
    ]

    operations = [
        migrations.CreateModel(
            name='requestBlood',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=20)),
                ('last_name', models.CharField(max_length=20)),
                ('phone', models.CharField(max_length=13)),
                ('blood_group', models.CharField(choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')], max_length=3)),
                ('address', models.CharField(max_length=90)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=1)),
                ('note', models.TextField()),
            ],
        ),
    ]
