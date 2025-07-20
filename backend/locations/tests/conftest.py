# Django
from django.contrib.auth.models import Group, User

# Pytest
import pytest

# App
from locations.models import City

# Write your fixtures here.


@pytest.fixture
def cities_list():
    return City.objects.bulk_create([
        City(name="Budapest", address="Street Budapest"),
        City(name="Bucharest", address="Street Bucharest"),
        City(name="Baku", address="Street Baku"),
        City(name="Belgrade", address="Street Belgrade"),
    ])

@pytest.fixture
def city_london():
    return City.objects.create(name="London", address="Street London")

@pytest.fixture
def manager_group():
    return Group.objects.create(name="Manager")

@pytest.fixture
def manager_user(manager_group):
    user = User.objects.create_user(username="manager", password="test123", is_staff=False)
    user.groups.add(manager_group)
    return user

@pytest.fixture
def staff_user():
    return User.objects.create_user(username="staff", password="test123", is_staff=True)

@pytest.fixture
def normal_user():
    return User.objects.create_user(username="user", password="test123")