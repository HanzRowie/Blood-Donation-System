from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from .models import donateBlood, requestBlood, Contact, Profile
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from  django.utils.http import  urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import User  # Your custom User model
from .utils import Util  # Import Util for sending emails

class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    conpassword = serializers.CharField(write_only=True)
    role = serializers.CharField()  

    def validate(self, data):
       
        if User.objects.filter(username=data['username'].lower()).exists():
            raise serializers.ValidationError("Username is already taken")

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email is already registered")

        
        if data['password'] != data['conpassword']:
            raise serializers.ValidationError("Passwords do not match")

        
        allowed_roles = ['donor', 'requester']
        if data['role'].lower() not in allowed_roles:
            raise serializers.ValidationError(f"Invalid role. Allowed roles are: {', '.join(allowed_roles)}")

        return data

    def create(self, validated_data):
        validated_data.pop('conpassword')

        user = User.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'].lower(),
            email=validated_data['email'],
            role=validated_data['role'].lower() 
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError('User not found')
        return data

    def get_jwt_token(self, validated_data):
        user = authenticate(username=validated_data['username'], password=validated_data['password'])

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email
            },
            'role': user.role if hasattr(user, 'role') else 'user'
        }


class DonateBloodSerializer(serializers.ModelSerializer):
    class Meta:
        model = donateBlood
        fields = '__all__'

class RequestBLoodSerializers(serializers.ModelSerializer):
    class Meta:
        model = requestBlood
        fields = '__all__'

class ContactSerializers(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ('user',)


class UserChangePasswordSerializer(serializers.Serializer):
    password  = serializers.CharField(max_length=128, write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(max_length=128, write_only=True, style={'input_type': 'password'})
    class Meta:
        fields = ('password', 'password2')
    def validate(self, attrs):
        password =  attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("Passwords do not match")
        user.set_password(password)
        user.save()
        return attrs

class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 255)
    class Meta:
        fields = ['email']

    def validate(self, attrs):
       email = attrs.get('email')
       if User.objects.filter(email = email).exists():
           user  = User.objects.get(email  = email)
           uid  =  urlsafe_base64_encode(force_bytes(user.id))
           print('Encoded UID', uid)
           token = PasswordResetTokenGenerator().make_token(user)
           print('Password   Reset Token',token)
           link  =  'http://localhost:3000/api/user/reset'+uid+'/'+token
           print("Password Reset Link", link)
           # Send  Email
           body = 'Click  Following Link to Reset Your Password'+link
           data={
               "subject":'Reset Your Password',
               'body':body,
               'to_email':user.email
           }
           Util.send_email(data)
           return attrs


       else: 
           raise serializers.ValidationError('You are not a registered user')


class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128, write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(max_length=128, write_only=True, style={'input_type': 'password'})

    class Meta:
        fields = ('password', 'password2')

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        uid = self.context.get('uid')
        token = self.context.get('token')

        if password != password2:
            raise serializers.ValidationError("Passwords do not match")

        try:
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError('Token is not valid or expired')
            user.set_password(password)
            user.save()
        except DjangoUnicodeDecodeError:
            raise ValidationError('Token is not valid or expired')

        return attrs
    

       