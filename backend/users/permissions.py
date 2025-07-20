# DRF
from rest_framework.permissions import BasePermission

# Write your permissions here.


class IsAdminOrInGroup(BasePermission):
    """ 
    Checks user to be Admin (SuperUser/Staff) OR 
    to be part of one of the specified group(s).
    """

    groups_names = []

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated and (
                user.is_superuser or
                user.is_staff or (
                    self.groups_names and
                    user.groups.filter(name__in=self.groups_names).exists()
                )
            )
        )


class IsManager(IsAdminOrInGroup):
    """ 
    Checks user to be Admin (SuperUser/Staff) OR
    to be part of the 'Manager' group. 
    """

    groups_names = ["Manager"]


class IsManagerOrEmployee(IsAdminOrInGroup):
    """ 
    Checks user to be Admin (SuperUser/Staff) OR
    to be part of one of the 'Manager', 'Employee' groups. 
    """

    groups_names = ["Manager", "Employee"]


class IsManagerOrCashier(IsAdminOrInGroup):
    """
    Checks user to be Admin (SuperUser/Staff) OR
    to be part of one of the 'Manager', 'Cashier' groups. 
    """

    groups_names = ["Manager", "Cashier"]


class IsCashier(IsAdminOrInGroup):
    """
    Checks user to be Admin (SuperUser/Staff) OR
    to be part of the 'Cashier' group.
    """
    groups_names = ["Cashier"]


class IsManagerOrEmployeeOrCashier(IsAdminOrInGroup):
    """
    Checks user to be Admin (SuperUser/Staff) OR
    to be part of one of the 'Manager', 'Employee' 'Cashier' groups. 
    """
        
    groups_names = ["Manager", "Employee", "Cashier"]