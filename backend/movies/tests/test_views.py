# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient
from rest_framework import status

# Pytest
import pytest

# App
from ..models import Genre, Movie

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Genre - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_genre_list_as_visitor(genres_list):
    client = APIClient()
    url = reverse("create-read-genres")
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_genre_list_as_normal_user(genres_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-genres")
    response = client.get(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_genre_list_as_manager(genres_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-genres")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 3
    assert "id" in data[0]
    assert data[0]["name"] == "Comedy"
    assert "created_at" in data[2]
    assert "updated_at" in data[2]


@pytest.mark.django_db
def test_genre_list_as_planner(genres_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-genres")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 3
    assert "id" in data[0]
    assert data[1]["name"] == "Drama"
    assert "created_at" in data[2]
    assert "updated_at" in data[2]


@pytest.mark.django_db
def test_genre_list_as_staff(genres_list, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-genres")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 3
    assert "id" in data[0]
    assert data[1]["name"] == "Drama"
    assert "created_at" in data[2]
    assert "updated_at" in data[2]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Genre - CREATE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_genre_create_as_visitor():
    client = APIClient()
    url = reverse("create-read-genres")
    response = client.post(url, data={"name": "Sport"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_genre_create_as_normal_user(normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-genres")
    response = client.post(url, data={"name": "Sport"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_genre_create_as_manager(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-genres")
    response = client.post(url, data={"name": "Sport"})

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_genre_create_as_planner(planner_user):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("create-read-genres")
    response = client.post(url, data={"name": "Sport"})

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_genre_create_as_staff(staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-genres")
    response = client.post(url, data={"name": "Sport"})

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_genre_create_as_manager_no_field(manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-genres")
    response = client.post(url, data={})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_genre_create_as_manager_invalid_field(planner_user):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("create-read-genres")
    response = client.post(url, data={"type": "Horror"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Genre - PATCH
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_genre_patch_as_normal_user(normal_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("update-delete-genres", kwargs={"id": genre_action.id})
    response = client.patch(url, data={"name": "Updated"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_genre_patch_as_manager(manager_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("update-delete-genres", kwargs={"id": genre_action.id})
    response = client.patch(url, data={"name": "Updated"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Updated"


@pytest.mark.django_db
def test_genre_patch_as_planner(planner_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("update-delete-genres", kwargs={"id": genre_action.id})
    response = client.patch(url, data={"name": "Updated"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Updated"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Genre - DELETE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_genre_delete_as_visitor(genre_action):
    client = APIClient()
    url = reverse("update-delete-genres", kwargs={"id": genre_action.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_genre_delete_as_staff(staff_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("update-delete-genres", kwargs={"id": genre_action.id})
    response = client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Genre.objects.filter(id=genre_action.id).exists()


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

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 2
    assert "id" in data[0]
    assert "title" in data[0]
    assert "director" in data[0]


@pytest.mark.django_db
def test_movie_staff_list_as_planner(movies_list, planner_user):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("create-read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 2
    assert "id" in data[0]
    assert "title" in data[0]
    assert "director" in data[0]


@pytest.mark.django_db
def test_movie_staff_list_as_staff(movies_list, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-movies")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 2
    assert "id" in data[1]
    assert "title" in data[1]
    assert "director" in data[1]



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
    response = client.post(
        url,
        data={
            "title": "New Movie",
            "description": "New desc",
            "genres": [genre_action.id],
            "poster": "https://images.new",
            "director": "New Director",
            "cast": "New cast",
            "release": "2026-01-01",
            "duration": "01:30:00",
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_movie_create_as_planner(planner_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("create-read-movies")
    response = client.post(
        url,
        data={
            "title": "New Movie",
            "description": "New desc",
            "genres": [genre_action.id],
            "poster": "https://images.new",
            "director": "New Director",
            "cast": "New cast",
            "release": "2026-01-01",
            "duration": "01:30:00",
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_movie_create_as_staff(staff_user, genre_action):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-movies")
    response = client.post(
        url,
        data={
            "title": "New Movie",
            "description": "New desc",
            "genres": [genre_action.id],
            "poster": "https://images.new",
            "director": "New Director",
            "cast": "New cast",
            "release": "2026-01-01",
            "duration": "01:30:00",
        },
    )

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
