# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient
from rest_framework import status

# Pytest
import pytest

# App
from ..models import City, Theater

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# City - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_city_list_as_visitor(city_london):
    client = APIClient()
    url = reverse("create-read-cities")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: PartialSerializer
    assert "name" in response.data[0]
    assert "address" not in response.data[0]


@pytest.mark.django_db
def test_city_list_as_normal_user(city_london, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-cities")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: PartialSerializer
    assert "name" in response.data[0]
    assert "address" not in response.data[0]


@pytest.mark.django_db
def test_city_list_as_manager(city_london, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-cities")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert "name" in response.data[0]
    assert "address" in response.data[0]


@pytest.mark.django_db
def test_city_list_as_staff(city_london, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-cities")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert "name" in response.data[0]
    assert "address" in response.data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# City - CREATE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_city_create_as_visitor():
    client = APIClient()
    url = reverse("create-read-cities")
    response = client.post(url, data={"name": "Paris", "address": "Street Paris"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_city_create_as_normal_user(normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-cities")
    response = client.post(url, data={"name": "Paris", "address": "Street Paris"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_city_create_as_staff(staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-cities")
    response = client.post(url, data={"name": "Paris", "address": "Street Paris"})

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_city_create_as_manager(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-cities")
    response = client.post(url, data={"name": "Paris", "address": "Street Paris"})

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_city_create_as_manager_no_field(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-cities")
    response = client.post(url, data={"name": "Paris"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_city_create_as_manager_invalid_field(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-cities")
    response = client.post(url, data={"name": "Paris", "country": "France"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# City - PATCH
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_city_patch_as_normal_user(normal_user, city_london):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("update-delete-cities", kwargs={"id": city_london.id})
    response = client.patch(url, data={"address": "Updated Street"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_city_patch_as_manager(manager_user, city_london):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("update-delete-cities", kwargs={"id": city_london.id})
    response = client.patch(url, data={"address": "Updated Street"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["address"] == "Updated Street"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# City - DELETE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_city_delete_as_visitor(city_london):
    client = APIClient()
    url = reverse("update-delete-cities", kwargs={"id": city_london.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_city_delete_as_staff(staff_user, city_london):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("update-delete-cities", kwargs={"id": city_london.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not City.objects.filter(id=city_london.id).exists()


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Theater - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_theater_list_as_visitor(theater_room_berlin):
    client = APIClient()
    url = reverse("create-read-theaters")
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_theater_list_as_normal_user(theater_room_berlin, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-theaters")
    response = client.get(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_theater_list_as_manager(theater_room_berlin, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-theaters")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert len(response.data) == 1
    assert "id" in response.data[0]
    assert "name" in response.data[0]
    assert "city_name" in response.data[0]
    assert "rows" in response.data[0]
    assert "columns" in response.data[0]
    assert "created_at" in response.data[0]
    assert "updated_at" in response.data[0]


@pytest.mark.django_db
def test_theater_list_as_staff(theater_room_berlin, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-theaters")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert len(response.data) == 1
    assert "id" in response.data[0]
    assert "name" in response.data[0]
    assert "city_name" in response.data[0]
    assert "rows" in response.data[0]
    assert "columns" in response.data[0]
    assert "created_at" in response.data[0]
    assert "updated_at" in response.data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Theater - CREATE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_theater_create_as_visitor(city_london):
    client = APIClient()
    url = reverse("create-read-theaters")
    response = client.post(
        url, data={"name": "Room", "city": city_london.name, "rows": 2, "columns": 3}
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_theater_create_as_normal_user(normal_user, city_london):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-theaters")
    response = client.post(
        url, data={"name": "Room", "city": city_london.name, "rows": 2, "columns": 3}
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_theater_create_as_staff(staff_user, city_london):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-theaters")
    response = client.post(
        url, data={"name": "Room", "city": city_london.name, "rows": 2, "columns": 3}
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_theater_create_as_manager(manager_user, city_london):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-theaters")
    response = client.post(
        url, data={"name": "Room", "city": city_london.name, "rows": 2, "columns": 3}
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_theater_create_as_manager_no_field(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-theaters")
    response = client.post(url, data={"name": "Room", "rows": 2})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_theater_create_as_manager_invalid_field(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-theaters")
    response = client.post(url, data={"name": "Room", "country": "France"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Theater - PATCH
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_theater_patch_as_normal_user(normal_user, theater_room_berlin):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("update-delete-theaters", kwargs={"id": theater_room_berlin.id})
    response = client.patch(url, data={"name": "Updated"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_theater_patch_as_manager(manager_user, theater_room_berlin):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("update-delete-theaters", kwargs={"id": theater_room_berlin.id})
    response = client.patch(url, data={"name": "Updated"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Updated"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Theater - DELETE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_theater_delete_as_visitor(theater_room_berlin):
    client = APIClient()
    url = reverse("update-delete-theaters", kwargs={"id": theater_room_berlin.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_theater_delete_as_staff(staff_user, theater_room_berlin):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("update-delete-theaters", kwargs={"id": theater_room_berlin.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Theater.objects.filter(id=theater_room_berlin.id).exists()
