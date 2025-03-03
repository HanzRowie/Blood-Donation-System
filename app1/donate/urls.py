from django.http import HttpResponse
from django.urls import path
from . import views

urlpatterns =[
    path("signin/",views.signin,name="signin"),
    path("login/",views.Handellogin,name="login"),
    path("donateblood/",views.donateBloodView,name="donateblood"),
    path("requestblood/",views.requestBloodView,name ="requestblood"),
    path("add/", views.add, name="add"),
    path("bloodHistory/", views.bloodHistory, name="bloodHistory"),
    path("saveHistory/<int:id>/", views.saveHistory, name="saveHistory"),
    path("deleteHistory/<int:id>/", views.deleteHistory, name="deleteHistory"),
    path("editHistory/<int:id>/", views.editHistory, name="editHistory"),
    path("addRequest/",views.addRequest,name = "addRequest"),
    path("getRequestHistory/",views.getRequestHistory, name = "getRequestHistory"),
    path("editRequestHistory/<int:id>/", views.editRequestHistory, name = "editRequestHistory"),
    path("saveRequestHistory/<int:id>/", views.saveRequestHistory, name = "saveRequestHistory"),
    path("deleteRequestHistory/<int:id>/",views.deleteRequestHistory, name = "deleteRequestHistory"),

]
   