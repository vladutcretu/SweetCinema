# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient
from rest_framework import status

# Pytest 
import pytest

# App
from ..models import City

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
