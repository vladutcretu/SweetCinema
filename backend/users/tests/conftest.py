# Pytest
import pytest

# App
from ..models import User
from locations.models import City

# Write your fixtures here.


@pytest.fixture
def manager_user():
    return User.objects.create_user(
        username="manager", password="test123", is_staff=False, role="manager"
    )


@pytest.fixture
def planner_user():
    return User.objects.create_user(
        username="planner", password="test123", is_staff=False, role="planner"
    )


@pytest.fixture
def cashier_user():
    return User.objects.create_user(
        username="cashier", password="test123", is_staff=False, role="cashier"
    )


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
    manager_user, planner_user, cashier_user, staff_user, normal_user1, normal_user2
):
    return [
        manager_user,
        planner_user,
        cashier_user,
        staff_user,
        normal_user1,
        normal_user2,
    ]


@pytest.fixture
def city_london():
    return City.objects.create(name="London")
