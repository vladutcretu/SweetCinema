# Django
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

# DRF
from rest_framework.test import APIClient
from rest_framework import status

# Pytest
import pytest

# App
from ..models import Showtime

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Showtime - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_list_without_city_param(showtimes_list):
    client = APIClient()
    url = reverse("read-showtimes")
    response = client.get(url)

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_showtime_list_with_invalid_city_param(showtimes_list):
    client = APIClient()
    url = reverse("read-showtimes")
    response = client.get(url, {"city": "London"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_showtime_list_with_valid_city_param(showtime_f1_london, city_london):
    client = APIClient()
    url = reverse("read-showtimes")
    response = client.get(url, {"city": city_london.id})

    assert response.status_code == status.HTTP_200_OK
    # Expected: MoviePartialSerializer
    assert len(response.data) == 1
    assert "id" in response.data[0]
    assert "movie" in response.data[0]
    assert response.data[0]["movie"]["title"] == "F1"
    assert response.data[0]["movie"]["genres"][0]["name"] == "Action"
    assert "starts_at" in response.data[0]


@pytest.mark.django_db
def test_showtime_list_with_valid_city_movie_params(
    showtime_f1_london, city_london, movie_f1
):
    client = APIClient()
    url = reverse("read-showtimes")
    response = client.get(url, {"city": city_london.id, "movie": movie_f1.id})

    assert response.status_code == status.HTTP_200_OK
    # Expected: PartialSerializer
    assert len(response.data) == 1
    assert "id" in response.data[0]
    assert "movie" not in response.data[0]
    assert response.data[0]["theater_name"] == "Room 1"
    assert "starts_at" in response.data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeStaff - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_staff_list_as_visitor(showtimes_list, normal_user):
    client = APIClient()
    url = reverse("create-read-showtimes")
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_showtime_staff_list_as_normal_user(showtimes_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-showtimes")
    response = client.get(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_showtime_staff_list_as_manager(showtimes_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-showtimes")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 2
    assert "id" in data[0]
    assert "movie_title" in data[1]
    assert "created_at" in data[1]


@pytest.mark.django_db
def test_showtime_staff_list_as_planner(showtimes_list, planner_user):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("create-read-showtimes")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 2
    assert "id" in data[0]
    assert "movie_title" in data[1]
    assert "created_at" in data[1]


@pytest.mark.django_db
def test_showtime_staff_list_as_staff(showtimes_list, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-showtimes")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 2
    assert "id" in data[1]
    assert "movie_title" in data[1]
    assert "created_at" in data[1]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# MovieStaff - CREATE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_create_as_visitor(movie_f1, theater_london):
    client = APIClient()
    url = reverse("create-read-showtimes")
    response = client.post(
        url,
        data={
            "movie": 1,
            "theater": 1,
            "starts_at": timezone.now() + timedelta(days=4, hours=1),
        },
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_showtime_create_as_normal_user(normal_user, movie_f1, theater_london):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-showtimes")
    response = client.post(
        url,
        data={
            "movie": movie_f1,
            "theater": theater_london.id,
            "starts_at": timezone.now() + timedelta(hours=1),
        },
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_showtime_create_as_manager(manager_user, movie_f1, theater_london):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-showtimes")
    response = client.post(
        url,
        data={
            "movie": movie_f1.id,
            "theater": theater_london.id,
            "starts_at": timezone.now() + timedelta(days=1, hours=1),
            "format": "IMAX",
            "presentation": "dub",
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_showtime_create_as_planner(planner_user, movie_f1, theater_london):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("create-read-showtimes")
    response = client.post(
        url,
        data={
            "movie": movie_f1.id,
            "theater": theater_london.id,
            "price": 45.50,
            "starts_at": timezone.now() + timedelta(days=2, hours=1),
            "format": "3D",
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_showtime_create_as_staff(staff_user, movie_f1, theater_london):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-showtimes")
    response = client.post(
        url,
        data={
            "movie": movie_f1.id,
            "theater": theater_london.id,
            "price": 50,
            "starts_at": timezone.now() + timedelta(days=3, hours=1),
            "presentation": "sub",
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_showtime_create_as_manager_no_field(manager_user, movie_f1, theater_london):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-showtimes")
    response = client.post(
        url, data={"movie": movie_f1.id, "theater": theater_london.id}
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_showtime_create_as_manager_invalid_field(
    manager_user, movie_f1, theater_london
):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-showtimes")
    response = client.post(
        url,
        data={
            "movie": movie_f1.id,
            "city": theater_london.id,
            "starts_at": "2025-07-23T16:00:00Z",
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Showtime - RETRIEVE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_retrieve(showtime_f1_london):
    client = APIClient()
    url = reverse(
        "retrieve-update-delete-showtimes", kwargs={"id": showtime_f1_london.id}
    )
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: RetrieveSerializer
    assert "id" in response.data
    assert "movie_title" in response.data
    assert "theater" in response.data
    assert response.data["theater"]["name"] == "Room 1"
    assert "starts_at" in response.data
    assert "created_at" not in response.data


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Showtime - PATCH
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_patch_as_normal_user(normal_user, showtime_f1_london):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse(
        "retrieve-update-delete-showtimes", kwargs={"id": showtime_f1_london.id}
    )
    response = client.patch(url, data={"price": "500"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_showtime_patch_as_manager(manager_user, showtime_f1_london):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse(
        "retrieve-update-delete-showtimes", kwargs={"id": showtime_f1_london.id}
    )
    response = client.patch(url, data={"format": "2D"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["format"] == "2D"


@pytest.mark.django_db
def test_showtime_patch_as_planner(planner_user, showtime_f1_london):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse(
        "retrieve-update-delete-showtimes", kwargs={"id": showtime_f1_london.id}
    )
    response = client.patch(url, data={"format": "4DX"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["format"] == "4DX"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Showtime - DELETE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_delete_as_visitor(showtime_f1_london):
    client = APIClient()
    url = reverse(
        "retrieve-update-delete-showtimes", kwargs={"id": showtime_f1_london.id}
    )
    response = client.delete(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_showtime_delete_as_staff(staff_user, showtime_f1_london):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse(
        "retrieve-update-delete-showtimes", kwargs={"id": showtime_f1_london.id}
    )
    response = client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Showtime.objects.filter(id=showtime_f1_london.id).exists()


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeSeats - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_seats_list_as_visitor(showtime_f1_london):
    client = APIClient()
    url = reverse("read-showtimes-seats", kwargs={"id": showtime_f1_london.id})
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: SeatStatusSerializer
    assert "id" in response.data[0]
    assert "movie_title" not in response.data[0]
    assert "starts_at" not in response.data[0]
    assert "row" in response.data[1]
    assert "column" in response.data[1]
    assert "status" in response.data[1]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeReport - RETRIEVE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_showtime_report_retrieve_as_manager(manager_user, showtime_f1_london):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("retrieve-showtimes-report", kwargs={"id": showtime_f1_london.id})
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: ReportSerializer
    assert response.data["movie_title"] == "F1"
    assert response.data["city_name"] == "London"
    assert "tickets_sold" in response.data
    assert "total_revenue" in response.data
    assert "occupancy_percentage" in response.data


@pytest.mark.django_db
def test_showtime_report_retrieve_as_planner(planner_user, showtime_f1_london):
    client = APIClient()
    client.force_authenticate(user=planner_user)
    url = reverse("retrieve-showtimes-report", kwargs={"id": showtime_f1_london.id})
    response = client.get(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN
