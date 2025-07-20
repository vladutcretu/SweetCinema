# Django
from django.contrib.auth.models import Group, User

# Pytest
import pytest

# App
from locations.models import City, Theater

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

@pytest.fixture
def theaters_list():
    city = City.objects.create(name="Berlin", address="Street Berlin")
    return Theater.objects.bulk_create([
        Theater(name="Room 1", city=city, rows=1, columns=2),
        Theater(name="Room 2", city=city, rows=3, columns=4),
        Theater(name="Room 3", city=city, rows=5, columns=6),
        Theater(name="Room 4", city=city, rows=7, columns=8),
    ])

@pytest.fixture
def theater_room_berlin():
    city = City.objects.create(name="Berlin", address="Street Berlin")
    return Theater.objects.create(name="Room", city=city, rows=2, columns=4)