from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit or delete the product."""

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user