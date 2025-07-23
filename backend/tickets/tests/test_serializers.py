# Pytest
import pytest

# App
from ..serializers import (
    # Booking
    BookingPartialSerializer,
    BookingCompleteSerializer,
    BookingUpdateSerializer,
)

# Create your tests here.

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Booking
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_booking_partial_serializer(bookings_list):
    serializer = BookingPartialSerializer(bookings_list, many=True)
    data = serializer.data

    assert len(data) == 4

    assert "id" in data[0]
    assert "user" not in data[0]
    assert "showtime" in data[1]
    assert data[1]["showtime"]["movie_title"] == "F1"
    assert "seat" in data[2]
    assert data[2]["seat"]["column"] == bookings_list[2].seat.id
    assert data[3]["status"] == "Reserved"
    assert "booked_at" in data[3]
    assert "updated_at" not in data[4]
    assert "expires_at" in data[4]


@pytest.mark.django_db
def test_booking_complete_serializer(bookings_list):
    serializer = BookingCompleteSerializer(bookings_list, many=True)
    data = serializer.data

    assert len(data) == 4

    assert "id" in data[0]
    assert "user" in data[0]
    assert "showtime" in data[1]
    assert data[1]["showtime"]["movie_title"] == "F1"
    assert "seat" in data[2]
    assert data[2]["seat"]["column"] == bookings_list[2].seat.id
    assert data[3]["status"] == "Reserved"
    assert "booked_at" in data[3]
    assert "updated_at" in data[4]
    assert "expires_at" not in data[4]


@pytest.mark.django_db
def test_booking_update_serializer(booking_normal):
    serializer = BookingUpdateSerializer(booking_normal)
    data = serializer.data

    assert len(data) == 2

    assert "id" not in data
    assert "user" not in data
    assert "showtime" not in data
    assert "seat" not in data
    assert "booked_at" not in data
    assert "updated_at" not in data
    assert "status" in data
    assert "expires_at" in data
