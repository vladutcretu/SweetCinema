# Pytest
import pytest

# App
from ..serializers import (
    # City
    CityPartialSerializer,
    CityCompleteSerializer,
    CityUpdateSerializer,
    # Theater
    TheaterCompleteSerializer,
    TheaterCreateSerializer,
    TheaterUpdateSerializer,
)

# Create your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# City
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_city_partial_serializer(cities_list):
    serializer = CityPartialSerializer(cities_list, many=True)
    data = serializer.data

    assert data[0]["name"] == "Budapest"
    assert "address" not in data[0]
    assert data[1]["name"] == "Bucharest"
    assert "address" not in data[1]
    assert data[2]["name"] == "Baku"
    assert "address" not in data[2]
    assert data[3]["name"] == "Belgrade"
    assert "address" not in data[3]


@pytest.mark.django_db
def test_city_complete_serializer(cities_list):
    serializer = CityCompleteSerializer(cities_list, many=True)
    data = serializer.data

    assert "id" in data[0]
    assert "created_at" in data[0]
    assert data[0]["name"] == "Budapest"
    assert data[0]["address"] == "Street Budapest"
    assert "id" in data[1]
    assert "created_at" in data[1]
    assert data[1]["name"] == "Bucharest"
    assert data[1]["address"] == "Street Bucharest"
    assert "id" in data[2]
    assert "created_at" in data[2]
    assert data[2]["name"] == "Baku"
    assert data[2]["address"] == "Street Baku"
    assert "id" in data[3]
    assert "created_at" in data[3]
    assert data[3]["name"] == "Belgrade"
    assert data[3]["address"] == "Street Belgrade"


@pytest.mark.django_db
def test_city_update_serializer(cities_list):
    serializer = CityUpdateSerializer(cities_list, many=True)
    data = serializer.data

    assert data[0]["name"] == "Budapest"
    assert data[0]["address"] == "Street Budapest"
    assert data[1]["name"] == "Bucharest"
    assert data[1]["address"] == "Street Bucharest"
    assert data[2]["name"] == "Baku"
    assert data[2]["address"] == "Street Baku"
    assert data[3]["name"] == "Belgrade"
    assert data[3]["address"] == "Street Belgrade"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Theater
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_theater_complete_serializer(theaters_list):
    serializer = TheaterCompleteSerializer(theaters_list, many=True)
    data = serializer.data

    assert len(data) == 4

    assert "id" in data[0]
    assert "created_at" in data[0]
    assert data[0]["name"] == "Room 1"
    assert data[0]["city_name"] == "Berlin"
    assert data[0]["rows"] == 1
    assert data[0]["columns"] == 2
    assert "id" in data[2]
    assert "created_at" in data[2]
    assert data[2]["name"] == "Room 3"
    assert data[2]["city_name"] == "Berlin"
    assert data[2]["rows"] == 5
    assert data[2]["columns"] == 6


@pytest.mark.django_db
def test_theater_create_serializer(theater_room_berlin):
    serializer = TheaterCreateSerializer(theater_room_berlin)
    data = serializer.data

    assert "id" not in data
    assert "created_at" not in data
    assert data["name"] == "Room"
    assert data["city"] == "Berlin"
    assert data["rows"] == 2
    assert data["columns"] == 4


@pytest.mark.django_db
def test_theater_update_serializer(theater_room_berlin):
    serializer = TheaterUpdateSerializer(theater_room_berlin)
    data = serializer.data

    assert "id" not in data
    assert "created_at" not in data
    assert data["name"] == "Room"
    assert "city" not in data
    assert data["rows"] == 2
    assert data["columns"] == 4
