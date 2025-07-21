# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient
from rest_framework import status

# Pytest 
import pytest

# App
from ..models import Movie

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_list_without_city_param(movies_list):
    client = APIClient()
    url = reverse("read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_movie_list_with_invalid_city_param(movies_list):
    client = APIClient()
    url = reverse("read-movies")
    response = client.get(url, {"city": "London"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_movie_list_with_valid_city_param(showtime_f1_london, movie_f1, city_london):
    client = APIClient()
    url = reverse("read-movies")
    response = client.get(url, {"city": city_london.id})

    assert response.status_code == status.HTTP_200_OK
    # Expected: PartialSerializer
    assert len(response.data) == 1
    assert "id" in response.data[0] 
    assert "title" in response.data[0] 
    assert "director" not in response.data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# MovieStaff - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_staff_list_as_visitor(movies_list, normal_user):
    client = APIClient()
    url = reverse("create-read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_movie_staff_list_as_normal_user(movies_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_movie_staff_list_as_manager(movies_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 2
    assert "id" in response.data[0] 
    assert "title" in response.data[0] 
    assert "director" in response.data[0]


@pytest.mark.django_db
def test_movie_staff_list_as_employee(movies_list, employee_user):
    client = APIClient()
    client.force_authenticate(user=employee_user)
    url = reverse("create-read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 2
    assert "id" in response.data[0] 
    assert "title" in response.data[0] 
    assert "director" in response.data[0]


@pytest.mark.django_db
def test_movie_staff_list_as_staff(movies_list, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 2
    assert "id" in response.data[0] 
    assert "title" in response.data[0] 
    assert "director" in response.data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# MovieStaff - CREATE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_create_as_visitor():
    client = APIClient()
    url = reverse("create-read-movies")
    response = client.post(url, data={"title": "New Movie"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_movie_create_as_normal_user(normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-movies")
    response = client.post(url, data={"title": "New Movie"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_movie_create_as_manager(manager_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-movies")
    response = client.post(url, data={
        "title": "New Movie",
        "description": "New desc",
        "genres": [genre_action.id],
        "poster": "https://images.new",
        "director": "New Director",
        "cast": "New cast",
        "release": "2026-01-01",
        "duration": "01:30:00"
    })

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_movie_create_as_employee(employee_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=employee_user)
    url = reverse("create-read-movies")
    response = client.post(url, data={
        "title": "New Movie",
        "description": "New desc",
        "genres": [genre_action.id],
        "poster": "https://images.new",
        "director": "New Director",
        "cast": "New cast",
        "release": "2026-01-01",
        "duration": "01:30:00"
    })

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_movie_create_as_staff(staff_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-movies")
    response = client.post(url, data={
        "title": "New Movie",
        "description": "New desc",
        "genres": [genre_action.id],
        "poster": "https://images.new",
        "director": "New Director",
        "cast": "New cast",
        "release": "2026-01-01",
        "duration": "01:30:00"
    })

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_movie_create_as_manager_no_field(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-movies")
    response = client.post(url, data={"title": "New Movie", "description": "New desc"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_movie_create_as_manager_invalid_field(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-movies")
    response = client.post(url, data={"title": "New Movie", "location": "Anywhere"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie - RETRIEVE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_retrieve(movie_f1):
    client = APIClient()
    url = reverse("retrieve-update-delete-movies", kwargs={"id": movie_f1.id})
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: RetrieveSerializer
    assert "id" in response.data
    assert "title" in response.data
    assert "director" in response.data
    assert "created_at" not in response.data


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie - PATCH
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_patch_as_normal_user(normal_user, movie_f1):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("retrieve-update-delete-movies", kwargs={"id": movie_f1.id})
    response = client.patch(url, data={"title": "Updated Title"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_movie_patch_as_manager(manager_user, movie_f1):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("retrieve-update-delete-movies", kwargs={"id": movie_f1.id})
    response = client.patch(url, data={"title": "Updated Title"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["title"] == "Updated Title"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie - DELETE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_delete_as_visitor(movie_f1):
    client = APIClient()
    url = reverse("retrieve-update-delete-movies", kwargs={"id": movie_f1.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_movie_delete_as_staff(staff_user, movie_f1):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("retrieve-update-delete-movies", kwargs={"id": movie_f1.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Movie.objects.filter(id=movie_f1.id).exists()
