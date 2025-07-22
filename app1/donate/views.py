from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import donateBlood, requestBlood, Contact, Profile, BloodStock
import json
from django.shortcuts import render
from .serializers import RegisterSerializer,LoginSerializer, DonateBloodSerializer, RequestBLoodSerializers, ContactSerializers, UserChangePasswordSerializer, ProfileSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated 
from django.db.models import Q
from django.core.paginator import Paginator
from django.core.mail import send_mail
from django.conf import settings
from .permissions import IsDonor, IsRequester, IsAdmin
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser



class SearchBlood(APIView):
    def get(self, request):
        search_query = request.GET.get('search', '')  
        blood_group = request.GET.get('blood_group', '') 

        queryset = donateBlood.objects.all()

        if search_query:
            queryset = queryset.filter(address__icontains=search_query)

        if blood_group:
            # Case-insensitive exact match for blood group
            queryset = queryset.filter(blood_group__iexact=blood_group)

        page_number = request.GET.get('page', 1)
        paginator = Paginator(queryset, 2)  
        page_obj = paginator.get_page(page_number)

        serializer = DonateBloodSerializer(page_obj, many=True)

        return Response({
            'data': serializer.data,
            'message': "Donor(s) fetched successfully"
        }, status=status.HTTP_200_OK)


class SearchRequest(APIView):
    def get(self, request):
        search_query = request.GET.get('search', '')
        blood_group = request.GET.get('blood_group', '')

        queryset = requestBlood.objects.all()

        if search_query:
            queryset = queryset.filter(address__icontains=search_query)

        if blood_group:
            queryset = queryset.filter(blood_group__iexact=blood_group)

        page_number = request.GET.get('page', 1)
        paginator = Paginator(queryset, 2)  
        page_obj = paginator.get_page(page_number)

        serializer = RequestBLoodSerializers(page_obj, many=True)

        return Response({
            'data': serializer.data,
            'message': "Request(s) fetched successfully"
        }, status=status.HTTP_200_OK)



class RegisterView(APIView):
    def post(self, request):
        try: 
            data = request.data
            serializer = RegisterSerializer(data=data)
            
            if not serializer.is_valid():
                return Response({
                    'data': serializer.errors,
                    'message': "Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)

            user = serializer.save()

            user_email = user.email
            user_name = user.first_name

            subject = "Welcome to Our Platform!"
            message = f"Hi {user_name},\n\nThank you for registering with us. Your account has been created successfully.\n\nBest regards,\nYour Team"

            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user_email],
                    fail_silently=False,
                )
            except Exception as e:
                return Response({
                    'data': str(e),
                    'message': "User created but email failed to send"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                'data': {},
                'message': "Your account has been created successfully and a confirmation email has been sent"
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'data': str(e),
                'message': "An error occurred"
            }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'data': serializer.errors,
                    'message': "Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            
            token_response = serializer.get_jwt_token(serializer.validated_data)
            return Response(token_response, status=status.HTTP_200_OK)
        
        except Exception as e:
            print("Login error:", e) 
            return Response({
                'data': {},
                'message': "An error occurred"
            }, status=status.HTTP_400_BAD_REQUEST)

def Handellogout(request):
        if request.method =="POST":
             try:
                  logout(request)
                  return JsonResponse({"success": "You are successfully logged out."}, status=200)
             
             except Exception as e:
                return JsonResponse({"error": f"Error during logout: {str(e)}"}, status=500)
        return JsonResponse({"error": "Invalid request method."}, status=405)

class  UserChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request,format = None):
        serializer  = UserChangePasswordSerializer(data = request.data, context = {'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password changed successfully'}, status=status.HTTP_200_OK)
        return  Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendPasswordResetEmailView(APIView):
    permission_classes = [AllowAny]
    def post(self, request , format= None):
        serializer = SendPasswordResetEmailSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
              return Response({'msg':'Password Reset Link send. Please check your Email'}, status=status.HTTP_200_OK)
        return  Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPasswordResetView(APIView):
    def post(self, request, uid, token, format = None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid,'token':token})
        if serializer.is_valid(raise_exception=True):
            return  Response ({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)
        return  Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DonateBloodView(APIView):
    permission_classes = [IsAuthenticated, IsDonor]
    def get(self, request, pk=None):
        if pk:
            don = get_object_or_404(donateBlood, pk=pk)
            serializer = DonateBloodSerializer(don)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            approved_donors = donateBlood.objects.filter(is_approved=True) 
            serializer = DonateBloodSerializer(approved_donors, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self,request):
        serializer = DonateBloodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response ({'msg': 'Blood request submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def put (self,request,pk = None):
    #     don = get_object_or_404(donateBlood, pk = pk)
    #     serializer =  DonateBloodSerializer(don,data = request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({'msg': 'Data updated successfully'}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def patch (self,request, pk = None):
    #     don = get_object_or_404(donateBlood,pk = pk )
    #     serializer = DonateBloodSerializer(don, data = request.data, partial = True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({'msg': 'Partial update successful'}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk=None):
    #     req = get_object_or_404(requestBlood, pk=pk)
    #     req.delete()
    #     return Response({'msg': 'Data deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class ViewAllRequests(APIView):
    permission_classes = [IsAuthenticated, IsDonor]

    def get(self, request):
        reqs = requestBlood.objects.all()
        serializer = RequestBLoodSerializers(reqs, many=True)
        return Response(serializer.data)


class RequestBloodView(APIView):
    permission_classes = [IsAuthenticated, IsRequester]
    def get(self, request, pk=None):
        if pk:
            req = get_object_or_404(requestBlood, pk=pk)
            serializer = RequestBLoodSerializers(req)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            approved_requests = requestBlood.objects.filter(is_approved=True)  
            serializer = RequestBLoodSerializers(approved_requests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        serializer = RequestBLoodSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Blood request submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, pk=None):
    #     req = get_object_or_404(requestBlood, pk=pk)
    #     serializer = RequestBLoodSerializers(req, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({'msg': 'Data updated successfully'}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def patch(self, request, pk=None):
    #     req = get_object_or_404(requestBlood, pk=pk)
    #     serializer = RequestBLoodSerializers(req, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({'msg': 'Partial update successful'}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk=None):
    #     req = get_object_or_404(requestBlood, pk=pk)
    #     req.delete()
    #     return Response({'msg': 'Data deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class ViewAllDonors(APIView):
    permission_classes = [IsAuthenticated, IsRequester]

    def get(self, request):
        donors = donateBlood.objects.all()
        serializer = DonateBloodSerializer(donors, many=True)
        return Response(serializer.data)


class AcceptRequestView(APIView):
    permission_classes = [IsAuthenticated, IsDonor]

    def post(self, request, pk):
        req = get_object_or_404(requestBlood, pk=pk)

        if req.accepted_by:
            return Response({'msg': 'Already accepted'}, status=400)

        req.accepted_by = request.user
        req.save()
        return Response({'msg': 'Request accepted by donor'})

class ContactView(APIView):
    def post(self,request):
        serializer = ContactSerializers(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Blood request submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Ensure only one profile per user
        if Profile.objects.filter(user=request.user).exists():
            return Response({'error': 'Profile already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'msg': 'Profile created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Profile updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Profile partially updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        profile.delete()
        return Response({'msg': 'Profile deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class MyDonationView(APIView):
    permission_classes = [IsAuthenticated, IsDonor]

    def get(self, request):
        donations = donateBlood.objects.filter(user=request.user)
        serializer = DonateBloodSerializer(donations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        donation = get_object_or_404(donateBlood, pk=pk, user=request.user)
        donation.delete()
        return Response({'msg': 'Your donation entry was deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        donation = get_object_or_404(donateBlood, pk=pk, user=request.user)
        serializer = DonateBloodSerializer(donation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Your donation entry was updated'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        donation = get_object_or_404(donateBlood, pk=pk, user=request.user)
        serializer = DonateBloodSerializer(donation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Your donation entry was updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyRequestView(APIView):
    permission_classes = [IsAuthenticated, IsRequester]

    def get(self, request):
        requests = requestBlood.objects.filter(user=request.user)
        serializer = RequestBLoodSerializers(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        req = get_object_or_404(requestBlood, pk=pk, user=request.user)
        req.delete()
        return Response({'msg': 'Your request was deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        req = get_object_or_404(requestBlood, pk=pk, user=request.user)
        serializer = RequestBLoodSerializers(req, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Your request was updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        req = get_object_or_404(requestBlood, pk=pk, user=request.user)
        serializer = RequestBLoodSerializers(req, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Your request was updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApproveDonationView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        donation = get_object_or_404(donateBlood, pk=pk)

        if donation.is_approved:
            return Response({'msg': 'Already approved'}, status=400)

        donation.is_approved = True
        donation.save()

        stock, created = BloodStock.objects.get_or_create(blood_group=donation.blood_group)
        stock.quantity += 1
        stock.save()

        return Response({'msg': 'Donation approved and stock updated'}, status=200)


class ApproveRequestView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        req = get_object_or_404(requestBlood, pk=pk)

        if req.is_approved:
            return Response({'msg': 'Already approved'}, status=400)

        stock = BloodStock.objects.filter(blood_group=req.blood_group).first()
        if not stock or stock.quantity < 1:
            return Response({'error': 'Not enough stock'}, status=400)

        req.is_approved = True
        req.save()

        stock.quantity -= 1
        stock.save()

        return Response({'msg': 'Request approved and stock reduced'}, status=200)
