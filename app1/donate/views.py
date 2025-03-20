from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import donateBlood, requestBlood, Contact
import json


@csrf_exempt
def signin(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            username = data.get('username')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            conpassword = data.get('conpassword')

            if not all([username, first_name, last_name, email, password, conpassword]):
                return JsonResponse({"error": "All fields are required."}, status=400)

            if password != conpassword:
                return JsonResponse({"error": "Passwords do not match."}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists."}, status=400)

            user = User.objects.create_user(username=username, email=email, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()

            return JsonResponse({"success": "User created successfully."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Error creating user: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def Handellogin(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful!"}, status=200)
        else:
            return JsonResponse({"error": "Invalid username or password"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


def Handellogout(request):
        if request.method =="POST":
             try:
                  logout(request)
                  return JsonResponse({"success": "You are successfully logged out."}, status=200)
             
             except Exception as e:
                return JsonResponse({"error": f"Error during logout: {str(e)}"}, status=500)
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def donateBloodView(request):
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            phone = data.get("phone")
            email = data.get("email")
            date_of_birth = data.get("date_of_birth")
            gender = data.get("gender")
            blood_group = data.get("blood_group")
            address = data.get("address")

            if not all ([first_name, last_name, phone, email, date_of_birth, gender, blood_group, address]):
                return JsonResponse({"error":"All fields are required"},status=400)
            
            donate = donateBlood(first_name = first_name, last_name=last_name, phone = phone, email = email, date_of_birth = date_of_birth, gender = gender, blood_group = blood_group,address = address)
            donate.save()

            return JsonResponse({"message": "Donate blood submitted successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"error": f"Error blood donation fail: {str(e)}"}, status=500)
        
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def requestBloodView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            phone = data.get('phone')
            gender = data.get('gender') 
            blood_group = data.get('blood_group')
            address = data.get('address')
            note = data.get('note')

            if not all([first_name, last_name, phone, gender, blood_group, address, note]):
                return JsonResponse({"error": "All fields are required"}, status=400)

          
            request_blood = requestBlood(
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                gender=gender,
                blood_group=blood_group,
                address=address,
                note=note
            )
            request_blood.save()

            return JsonResponse({"message": "Blood request submitted successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"error": f"Error: Blood request failed - {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def add(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            phone = data.get("phone")
            email = data.get("email")
            date_of_birth = data.get("date_of_birth")  
            gender = data.get("gender")
            blood_group = data.get("blood_group")
            address = data.get("address")

            if not all([first_name, last_name, phone, email, date_of_birth, gender, blood_group, address]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            donate = donateBlood.objects.create(
                first_name=first_name, last_name=last_name, phone=phone, 
                email=email, date_of_birth=date_of_birth, gender=gender, 
                blood_group=blood_group, address=address
            )
            return JsonResponse({"message": "Blood donation added successfully", "id": donate.id}, status=201)

        except Exception as e:
            return JsonResponse({"error": f"Error: {str(e)}"}, status=500)
        
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def bloodHistory(request):
    if request.method == "GET":
        # Get all donateBlood objects
        donatedb = donateBlood.objects.all()

        # Convert the queryset into a list of dictionaries
        donations = [
            {
                "id": d.id,
                "first_name": d.first_name,
                "last_name": d.last_name,
                "phone": d.phone,
                "email": d.email,
                "date_of_birth": str(d.date_of_birth),
                "gender": d.gender,
                "blood_group": d.blood_group,
                "address": d.address,
            }
            for d in donatedb
        ]

        return JsonResponse({"donations": donations}, safe=False)

@csrf_exempt
def editHistory(request, id):
    donatedb = get_object_or_404(donateBlood, id=id)
    return JsonResponse({
        "id": donatedb.id, "first_name": donatedb.first_name, "last_name": donatedb.last_name,
        "phone": donatedb.phone, "email": donatedb.email, "date_of_birth": str(donatedb.date_of_birth),
        "gender": donatedb.gender, "blood_group": donatedb.blood_group, "address": donatedb.address
    })

@csrf_exempt
def saveHistory(request, id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            donatedb = get_object_or_404(donateBlood, id=id)

            donatedb.first_name = data.get("first_name", donatedb.first_name)
            donatedb.last_name = data.get("last_name", donatedb.last_name)
            donatedb.phone = data.get("phone", donatedb.phone)
            donatedb.email = data.get("email", donatedb.email)
            donatedb.date_of_birth = data.get("date_of_birth", donatedb.date_of_birth)
            donatedb.gender = data.get("gender", donatedb.gender)
            donatedb.blood_group = data.get("blood_group", donatedb.blood_group)
            donatedb.address = data.get("address", donatedb.address)

            donatedb.save()
            return JsonResponse({"message": "Blood donation updated successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Update failed: {str(e)}"}, status=500)

@csrf_exempt
def deleteHistory(request, id):
    donatedb = get_object_or_404(donateBlood, id=id)
    donatedb.delete()
    return JsonResponse({"message": "Record deleted successfully"}, status=200) 


@csrf_exempt
def addRequest(request):
    if request.method == "POST":
        try:
            # Parse JSON safely
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        # Extract fields
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        phone = data.get("phone")
        blood_group = data.get("blood_group")
        address = data.get("address")
        gender = data.get("gender")
        note = data.get("note", "")  

        # Validate required fields
        if None in [first_name, last_name, phone, blood_group, address, gender]:
            return JsonResponse({"error": "All fields except note are required"}, status=400)

        # Create request
        requestbd = requestBlood.objects.create(
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            blood_group=blood_group,
            address=address,
            gender=gender,
            note=note
        )

        return JsonResponse({"message": "Blood request successfully created", "id": requestbd.id}, status=201)

    # **Handle GET and other methods properly**
    return JsonResponse({"error": "Method not allowed"}, status=405)
def getRequestHistory(request):
    if request.method == "GET":

        requestHst  = requestBlood.objects.all()

        requested = [
            {
                "id": r.id,
                "first_name" : r.first_name,
                "last_name" :  r.last_name,
                "phone" : r.phone,
                "blood_group" : r.blood_group,
                "address" : r.address,
                "gender"  :  r.gender,
                "note" : r.note,
            }
            for r in requestHst
        ]

        return JsonResponse({"requested": requested}, safe=False)
    
@csrf_exempt
def editRequestHistory(request, id):
    requestHst = get_object_or_404(requestBlood, id=id)

    return JsonResponse({
        "id": requestHst.id, "first_name": requestHst.first_name, "last_name" : requestHst.last_name, "phone": requestHst.phone, "blood_group": requestHst.blood_group,
        "address": requestHst.address, "gender":requestHst.gender, "note": requestHst.note
    })

   
@csrf_exempt
def  saveRequestHistory(request, id):
    if request.method =="POST":
        try:  
            data = json.loads(request.body)
            requestHst = get_object_or_404(requestBlood, id = id)

            requestHst.first_name =  data.get("first_name",requestHst.first_name)
            requestHst.last_name =  data.get("last_name",requestHst.last_name)
            requestHst.phone =  data.get("phone",requestHst.phone)
            requestHst.blood_group =  data.get("blood_group",requestHst.blood_group)
            requestHst.address =  data.get("address",requestHst.address)
            requestHst.gender =  data.get("gender",requestHst.gender)
            requestHst.note =  data.get("note",requestHst.note)

            requestHst.save()

            return JsonResponse({"message":"Blood request updated successfully"}, status=200)
        
        except Exception as  e:
            return  JsonResponse({"error": f"update failed:{str(e)}"}, status  =  500)
        
@csrf_exempt
def deleteRequestHistory(request, id):
        
    requestHst = get_object_or_404(requestBlood, id=id)
    requestHst.delete()
    return JsonResponse({"message": "Blood request deleted successfully"}, status=200)
  


@csrf_exempt
def bloodContact(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            address = data.get('address')
            feedback = data.get('feedback')

            if  not all ([name,email,address,feedback]):
                return  JsonResponse({"error":"All fields are required"},status =405)
            
            contact = Contact(name = name,  email = email, address = address, feedback = feedback)
            contact.save()

            return JsonResponse({"message": "Message send successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"message":"Your feedback has been successfully sent."}, status=200)
        
    return JsonResponse({'error':"Method not allowed"},status = 405)

 