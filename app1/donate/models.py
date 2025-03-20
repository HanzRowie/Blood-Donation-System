from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class donateBlood(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null= True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    phone = models.PositiveIntegerField(blank=True)
    email =  models.EmailField()
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    address = models.CharField(max_length=20)

    def __str__(self):
        return self.first_name or "Unnamed Donor"
    

class requestBlood(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),                   
    ]
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]
    user = models.ForeignKey(User,on_delete=models.CASCADE, null= True)
    first_name = models.CharField(max_length=20)
    last_name  = models.CharField(max_length=20)
    phone = models.CharField(max_length=13)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    address = models.CharField(max_length=90)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    note = models.TextField()
    
    def __str__(self):
        return self.first_name



class Contact(models.Model):
    name = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.CharField(max_length=50)
    feedback = models.TextField()

    def __str__(self):
        return self.name