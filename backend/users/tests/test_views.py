# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient

# Pytest
import pytest

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserDataView - Retrieve
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_user_data_as_visitor():
    client = APIClient()
    url = reverse("read-own-user")
    response = client.get(url)

    assert response.status_code == 401


@pytest.mark.django_db
def test_user_data_as_user(normal_user2):
    client = APIClient()
    client.force_authenticate(user=normal_user2)

    url = reverse("read-own-user")
    response = client.get(url)

    assert response.status_code == 200
    assert response.data["username"] == normal_user2.username


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Users - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_user_list_as_user(normal_user2):
    client = APIClient()
    client.force_authenticate(user=normal_user2)

    url = reverse("read-users")
    response = client.get(url)

    assert response.status_code == 403


@pytest.mark.django_db
def test_user_list_as_staff(users_list, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)

    url = reverse("read-users")
    response = client.get(url)

    assert response.status_code == 200

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 5
    # Expected: CompleteSerializer
    assert "role" in data[0]
    assert "groups" not in data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# User - PATCH
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_user_update_as_user(normal_user2):
    client = APIClient()
    client.force_authenticate(user=normal_user2)
    url = reverse("retrieve-update-users", kwargs={"id": normal_user2.id})
    response = client.patch(url, {"city": "X"})

    assert response.status_code == 200


@pytest.mark.django_db
def test_user_update_as_staff(staff_user, normal_user2, city_london):
    data = {
        "role": "cashier",
        "city_name": city_london.name,
        "username": "Updated",
    }

    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("retrieve-update-users", kwargs={"id": normal_user2.id})
    response = client.patch(url, data, format="json")

    assert response.status_code == 200
    normal_user2.refresh_from_db()
    assert normal_user2.first_name != "Updated"
    assert normal_user2.role == "cashier"
    assert normal_user2.city == city_london


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserSetPassword – POST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_user_set_password_as_user(normal_user2):
    client = APIClient()
    client.force_authenticate(user=normal_user2)

    url = reverse("user-set-password")
    response = client.post(url, {"password": "test1234"})

    assert response.status_code == 403


@pytest.mark.django_db
def test_user_set_password_success(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)

    url = reverse("user-set-password")
    data = {"password": "test1234"}
    response = client.post(url, data)

    assert response.status_code == 200
    assert response.data["success"] == "Password set successfully."
    assert manager_user.check_password("test1234")


@pytest.mark.django_db
def test_user_set_password_invalid_too_short(cashier_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)

    url = reverse("user-set-password")
    data = {"password": "test"}
    response = client.post(url, data)

    assert response.status_code == 400
    assert "password" in response.data


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserVerifyPassword – POST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_user_verify_password_as_user(normal_user2):
    client = APIClient()
    client.force_authenticate(user=normal_user2)
    url = reverse("user-verify-password")
    response = client.post(url, {"password": "test1234"})

    assert response.status_code == 403


@pytest.mark.django_db
def test_user_verify_password_success(manager_user):
    manager_user.set_password("test1234")
    manager_user.save()

    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("user-verify-password")
    data = {"password": "test1234"}
    response = client.post(url, data)

    assert response.status_code == 200
    assert response.data["success"] == "Password matches."


@pytest.mark.django_db
def test_user_verify_password_incorrect(manager_user):
    manager_user.set_password("test1234")
    manager_user.save()

    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("user-verify-password")
    data = {"password": "test4321"}
    response = client.post(url, data)

    assert response.status_code == 401
    assert response.data["failure"] == "Password do not match."
