# DRF
from rest_framework.permissions import BasePermission

# Write your permissions here.


class IsAdminOrHaveRole(BasePermission):
    """
    Allows access if user is superuser/staff OR
    user.role is in allowed_roles list.
    """

    allowed_roles = []

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_superuser or user.is_staff:
            return True

        return user.role in self.allowed_roles


class IsManager(IsAdminOrHaveRole):
    """
    Checks user to be Admin (SuperUser/Staff) OR to have 'Manager' role.
    """

    allowed_roles = ["manager"]


class IsManagerOrPlanner(IsAdminOrHaveRole):
    """
    Checks user to be Admin (SuperUser/Staff) OR to have 'Manager' OR 'Planner' role.
    """

    allowed_roles = ["manager", "planner"]


class IsManagerOrCashier(IsAdminOrHaveRole):
    """
    Checks user to be Admin (SuperUser/Staff) OR to have 'Manager' OR 'Cashier' role.
    """

    allowed_roles = ["manager", "cashier"]


class IsCashier(IsAdminOrHaveRole):
    """
    Checks user to be Admin (SuperUser/Staff) OR to have 'Cashier' role.
    """

    allowed_roles = ["cashier"]


class IsManagerOrPlannerOrCashier(IsAdminOrHaveRole):
    """
    Checks user to be Admin (SuperUser/Staff) OR to have 'Manager' OR 'Planner' OR 'Cashier' role.
    """

    allowed_roles = ["manager", "planner", "cashier"]
