from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
import json


@csrf_exempt

def signin(request):
    if request.method =="POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            conpassword = data.get('conpassword')

            if conpassword != password:
                return JsonResponse({"error":"Your password donot match the password"},status=400)
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error":"User already exists"},status=400)
            
            user = User.objects.create_user(username=username,email=email,password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()

        except Exception as e:
            return JsonResponse({"error":f"Error creating user: {str(e)}"}, status=500)
        
    return JsonResponse({"error": "Invalid request method."}, status=405)


def Handellogin(request):
    if request.method =="POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request,user)
                return JsonResponse({"success": "You are successfully logged in."}, status=200)

            else:
                    return JsonResponse({"error": "Invalid username or password."}, status=400)
    
        except Exception as e:
            return JsonResponse({"error": f"Error during login: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


def Handellogout(request):
        if request.method =="POST":
             try:
                  logout(request)
                  return JsonResponse({"success": "You are successfully logged out."}, status=200)
             
             except Exception as e:
                return JsonResponse({"error": f"Error during logout: {str(e)}"}, status=500)
        return JsonResponse({"error": "Invalid request method."}, status=405)