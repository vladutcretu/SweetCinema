# Pytest
import pytest

# App
from ..serializers import (
    # Booking
    BookingPartialSerializer,
    BookingCompleteSerializer,
    BookingCreateSerializer,
    BookingUpdateSerializer,
    BookingPaymentTimeoutSerializer,
    BookingPaymentDisplaySerializer,
    BookingListPaymentSerializer,
    # Payment
    PaymentCompleteSerializer,
    PaymentCreateSerializer,
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
def test_booking_create_serializer(booking_user):
    serializer = BookingCreateSerializer(booking_user)
    data = serializer.data

    assert len(data) == 3

    assert "id" not in data
    assert "user" not in data
    assert "showtime_id" in data
    assert "seat" not in data
    assert "seat_ids" in data
    assert "status" in data
    assert "booked_at" not in data
    assert "updated_at" not in data
    assert "expires_at" not in data


@pytest.mark.django_db
def test_booking_update_serializer(booking_user):
    serializer = BookingUpdateSerializer(booking_user)
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


@pytest.mark.django_db
def test_booking_payment_timeout_serializer(booking_user):
    serializer = BookingPaymentTimeoutSerializer(booking_user)
    data = serializer.data

    assert len(data) == 1

    assert "id" in data
    assert "user" not in data
    assert "showtime" in data
    assert "booking_ids" in data


@pytest.mark.django_db
def test_booking_payment_display_serializer(booking_user):
    serializer = BookingPaymentDisplaySerializer(booking_user)
    data = serializer.data

    assert len(data) == 11

    assert "movie_title" in data
    assert "movie_release" not in data
    assert "theater_name" in data
    assert "city_name" in data 
    assert "city_address" in data
    assert "showtime_price" in data
    assert "showtime_format" in data
    assert "showtime_presentation" in data
    assert "showtime_starts" in data
    assert "seat_row" in data 
    assert "seat_column" in data


@pytest.mark.django_db
def test_booking_payment_serializer(booking_user):
    serializer = BookingListPaymentSerializer(booking_user)
    data = serializer.data

    assert len(data) == 1

    assert "id" not in data
    assert "user" not in data
    assert "showtime" not in data
    assert "booking_ids" in data


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Payment
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_payment_complete_serializer(payment_user):
    serializer = PaymentCompleteSerializer(payment_user)
    data = serializer.data

    assert len(data) == 1

    assert "id" in data
    assert "user" in data
    assert "@" in data["user"]
    assert "bookings" in data
    assert data[0]["bookings"]["showtime"]["movie_title"] == "F1"
    assert data[0]["showtime"]["showtime"]["city_name"] == "London"
    assert "seat" in data
    assert "amount" in data
    assert "method" in data
    assert "status" in data
    assert "paid_at" in data


@pytest.mark.django_db
def test_payment_create_serializer(payment_user):
    serializer = PaymentCreateSerializer(payment_user)
    data = serializer.data
    assert len(data) == 1

    assert "id" not in data
    assert "booking_ids" in data
    assert "user" not in data
    assert "showtime" not in data
    assert "seat" not in data
    assert "amount" in data
    assert "method" in data
    assert "status" not in data
    assert "paid_at" not in data
