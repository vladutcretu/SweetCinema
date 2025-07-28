# Django
from django.utils import timezone
from datetime import timedelta

# Pytest
import pytest

# App
from ..serializers import (
    ShowtimePartialSerializer,
    ShowtimeMoviePartialSerializer,
    ShowtimeCompleteSerializer,
    ShowtimeCreateUpdateSerializer,
    ShowtimeRetrieveSerializer,
    ShowtimeSeatStatusSerializer,
    ShowtimeReportSerializer
)

# Create your tests here.


@pytest.mark.django_db
def test_showtime_partial_serializer(showtimes_list):
    serializer = ShowtimePartialSerializer(showtimes_list, many=True)
    data = serializer.data

    assert len(data) == 2

    assert "id" in data[0]
    assert "theater_name" in data[0]
    assert "price" in data[0]
    assert "created_at" not in data[0]
    assert "starts_at" in data[1]
    assert "format" in data[1]
    assert "presentation" in data[1]
    assert "updated_at" not in data[1]


@pytest.mark.django_db
def test_showtime_movie_partial_serializer(showtimes_list):
    serializer = ShowtimeMoviePartialSerializer(showtimes_list, many=True)
    data = serializer.data

    assert len(data) == 2

    assert "id" in data[0]
    assert data[0]["movie"]["genres"][0]["name"] == "Action"
    assert "price" not in data[0]
    assert "created_at" not in data[0]
    assert "starts_at" in data[1]
    assert "format" in data[1]
    assert "presentation" in data[1]
    assert "updated_at" not in data[1]


@pytest.mark.django_db
def test_showtime_complete_serializer(showtimes_list):
    serializer = ShowtimeCompleteSerializer(showtimes_list, many=True)
    data = serializer.data

    assert len(data) == 2

    assert "id" in data[0]
    assert data[0]["movie_title"] == "F1"
    assert data[0]["city_name"] == "London"
    assert "price" in data[0]
    assert "created_at" in data[0]
    assert data[1]["theater_name"] == "Room 1"
    assert "starts_at" in data[1]
    assert "format" in data[1]
    assert "presentation" in data[1]
    assert "updated_at" in data[1]


@pytest.mark.django_db
def test_showtime_create_update_serializer(showtime_f1_london):
    serializer = ShowtimeCreateUpdateSerializer(showtime_f1_london)
    data = serializer.data

    assert len(data) == 6

    assert "id" not in data
    assert "movie" in data
    assert "theater" in data
    assert data["price"] == "35.00"
    assert "starts_at" in data
    assert "format" in data
    assert "presentation" in data
    assert "created_at" not in data
    assert "updated_at" not in data


@pytest.mark.django_db
def test_showtime_retrieve_serializer(showtime_f1_london):
    serializer = ShowtimeRetrieveSerializer(showtime_f1_london)
    data = serializer.data

    assert len(data) == 7

    assert "id" in data
    assert data["movie_title"] == "F1"
    assert "movie" not in data
    assert "city_name" not in data
    assert data["theater"]["name"] == "Room 1"
    assert "price" in data
    assert "starts_at" in data
    assert "format" in data
    assert "presentation" in data
    assert "created_at" not in data
    assert "updated_at" not in data


@pytest.mark.django_db
def test_showtime_seat_status_serializer():
    serializer = ShowtimeSeatStatusSerializer({
        "id": 1,
        "row": 3,
        "column": 5,
        "status": "available"
    })
    data = serializer.data

    assert len(data) == 4

    assert "id" in data
    assert "movie" not in data
    assert "city" not in data
    assert "theater" not in data
    assert "price" not in data
    assert "starts_at" not in data
    assert "row" in data
    assert "column" in data
    assert "status" in data


@pytest.mark.django_db
def test_showtime_report_serializer():
    serializer = ShowtimeReportSerializer({
        "id": 1,
        "movie_title": "F1",
        "city_name": "London",
        "theater_name": "Room 1",
        "starts_at": timezone.now() + timedelta(days=1, hours=1),
        "tickets_sold": 4,
        "total_revenue": 120,
        "occupancy_percentage": 44
    })
    data = serializer.data

    assert len(data) == 8

    assert "id" in data
    assert "movie" not in data
    assert "movie_title" in data
    assert "city" not in data
    assert "city_name" in data
    assert "theater" not in data
    assert "theater_name" in data
    assert "price" not in data
    assert "starts_at" in data
    assert "tickets_sold" in data
    assert "total_revenue" in data
    assert "occupancy_percentage" in data
