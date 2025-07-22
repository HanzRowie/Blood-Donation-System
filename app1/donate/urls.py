from django.urls import path
from . import views

urlpatterns = [
    path("RegisterView/", views.RegisterView.as_view(), name="RegisterView"),
    path("LoginView/", views.LoginView.as_view(), name="LoginView"),
    path("changepassword/", views.UserChangePasswordView.as_view(), name="changepassword"),
    path("DonateBloodView/", views.DonateBloodView.as_view(), name="DonateBloodListCreate"),
    path("DonateBloodView/<int:pk>/", views.DonateBloodView.as_view(), name="DonateBloodDetail"),
    path("RequestBloodView/", views.RequestBloodView.as_view(), name="RequestBloodListCreate"),
    path("RequestBloodView/<int:pk>/", views.RequestBloodView.as_view(), name="RequestBloodDetail"),
    path("ContactView/", views.ContactView.as_view(), name="ContactView"),
    path("ViewAllDonors/", views.ViewAllDonors.as_view(), name="ViewAllDonors"),
    path("profile/", views.ProfileView.as_view(), name="profile-view"),
    path("SearchDonation/", views.SearchBlood.as_view(), name="SearchDonation"),
    path("SearchRequest/", views.SearchRequest.as_view(), name="SearchRequest"),
    path('acceptrequest/<int:pk>/', views.AcceptRequestView.as_view()),
    path('MyDonationView/', views.MyDonationView.as_view(),name = 'MyDonationView'),
    path('MyDonationView/<int:pk>/', views.MyDonationView.as_view(),name = 'MyDonationViewList'),
    path('MyRequMyDonationView/', views.MyRequestView.as_view(),name = 'MyRequestView'),
    path('ViewAllRequests/', views.ViewAllRequests.as_view(),name = 'ViewAllRequests'),
    path('MyRequestView/<int:pk>/', views.MyRequestView.as_view(),name = 'MyRequestViewList'),
    path('ApproveDonationView/<int:pk>/', views.ApproveDonationView.as_view(), name='ApproveDonationView'),
    path('ApproveRequestView/<int:pk>/', views.ApproveRequestView.as_view(), name='ApproveRequest'),
    path('UserPasswordResetView/<uid>/<token>/', views.UserPasswordResetView.as_view(), name='UserPasswordResetView'),
    path('SendPasswordResetEmai/', views.SendPasswordResetEmailView.as_view(), name='SendPasswordResetEmail')
]
