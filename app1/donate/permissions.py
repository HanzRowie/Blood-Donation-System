from rest_framework.permissions import BasePermission

class IsDonor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'donor'

class IsRequester(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'requester'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
