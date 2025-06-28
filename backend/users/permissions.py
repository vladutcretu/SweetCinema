# DRF
from rest_framework.permissions import BasePermission

# Write permissions here


class IsInGroup(BasePermission):
    """
    Global permission class for import and use on permission_classes attributes on API views.
    It checks user to be part of a group.
    """

    group_name = None

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated
            and self.group_name
            and user.groups.filter(name=self.group_name).exists()
        )


class IsManager(IsInGroup):
    group_name = "Manager"


class IsEmployee(IsInGroup):
    group_name = "Employee"


class IsManagerOrEmployee(BasePermission):
    """
    Global permission class for import and use on permission_classes attributes on API views.
    User must be in either 'Manager' or 'Employee' group.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        return user.groups.filter(name__in=["Manager", "Employee"]).exists()
