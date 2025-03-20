from django.contrib import admin
from .models import donateBlood, requestBlood,Contact

# Register your models here.

@admin.register(donateBlood)
class donateBloodAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name','phone','email','date_of_birth','gender','blood_group','address')


@admin.register(requestBlood)
class requestBloodAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name','phone','blood_group','address','note')



@admin.register(Contact)
class Contact(admin.ModelAdmin):
    list_display =  ('name','email','address','feedback')