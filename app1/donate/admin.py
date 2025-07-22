from django.contrib import admin
from .models import donateBlood, requestBlood,Contact, Profile,  BloodStock
from django.core.mail import send_mail
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# Register your models here.

@admin.register(donateBlood)
class DonateBloodAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'blood_group', 'is_approved')
    list_filter = ('is_approved', 'blood_group', 'gender')
    actions = ['approve_selected']

    def approve_selected(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} donation(s) approved.")
    approve_selected.short_description = "Approve selected donations"

@admin.register(requestBlood)
class RequestBloodAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'blood_group', 'is_approved')
    list_filter = ('is_approved', 'blood_group', 'gender')
    actions = ['approve_selected']

    def approve_selected(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} request(s) approved.")
    approve_selected.short_description = "Approve selected requests"



@admin.register(Contact)
class Contact(admin.ModelAdmin):
    list_display =  ('name','email','address','feedback')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display  = ('user', 'phone', 'address', 'profile_picture','blood_group','date_of_birth')

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )


def approve_selected(self, request, queryset):
    for obj in queryset:
        obj.is_approved = True
        obj.save()
        # Send email
        send_mail(
            "Your donation has been approved!",
            "Thank you for helping save lives.",
            "youremail@example.com",
            [obj.email],
            fail_silently=True,
        )

@admin.register(BloodStock)
class BloodStockAdmin(admin.ModelAdmin):
    list_display = ('blood_group', 'quantity') 
