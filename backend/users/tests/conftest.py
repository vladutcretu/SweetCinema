# Django
from django.contrib.auth.models import Group, User

# Pytest
import pytest

# App
from locations.models import City
from ..models import UserProfile

# Write your fixtures here.


@pytest.fixture
def manager_group():
    return Group.objects.create(name="Manager")

@pytest.fixture
def employee_group():
    return Group.objects.create(name="Employee")

@pytest.fixture
def cashier_group():
    return Group.objects.create(name="Cashier")

@pytest.fixture
def manager_user(manager_group):
    user = User.objects.create_user(username="manager", password="test123", is_staff=False)
    user.groups.add(manager_group)
    return user

@pytest.fixture
def employee_user(employee_group):
    user = User.objects.create_user(username="employee", password="test123", is_staff=False)
    user.groups.add(employee_group)
    return user

@pytest.fixture
def cashier_user(cashier_group):
    user = User.objects.create_user(username="cashier", password="test123", is_staff=False)
    user.groups.add(cashier_group)
    return user

# @pytest.fixture
# def cashier_profile(cashier_user, city_berlin):
#     return UserProfile.objects.create(user=cashier_user, city=city_berlin)

@pytest.fixture
def staff_user():
    return User.objects.create_user(username="staff", password="test123", is_staff=True)

@pytest.fixture
def normal_user1():
    return User.objects.create_user(username="user1", password="test123")

@pytest.fixture
def normal_user2():
    return User.objects.create_user(username="user2", password="test123")

@pytest.fixture
def users_list(
    manager_user,
    employee_user,
    cashier_user,
    staff_user,
    normal_user1,
    normal_user2
):
    return [
        manager_user,
        employee_user,
        cashier_user,
        staff_user,
        normal_user1,
        normal_user2
    ]

@pytest.fixture
def city_london():
    return City.objects.create(name="London")
