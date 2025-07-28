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
from ..models import Booking, BookingStatus

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
    assert data[3]["status"] == "Reserved"
    assert "booked_at" in data[3]
    assert "updated_at" not in data[3]
    assert "expires_at" in data[3]


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
    assert data[2]["status"] == "Purchased"
    assert "booked_at" in data[2]
    assert "updated_at" in data[3]
    assert "expires_at" not in data[3]


@pytest.mark.django_db
def test_booking_create_serializer(booking_user, showtime_f1_london, seats_theater_london):
    data = {
        "showtime_id": showtime_f1_london.id,
        "seat_ids": [seat.id for seat in seats_theater_london[3:]],
        "status": BookingStatus.RESERVED
    }

    serializer = BookingCreateSerializer(data=data, context={"request": booking_user})
    assert serializer.is_valid(), serializer.errors
    bookings = serializer.save()

    assert len(bookings) == len(data["seat_ids"])
    for booking in bookings:
        assert isinstance(booking, Booking)
        assert booking.showtime.id == data["showtime_id"]


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
    serializer = BookingPaymentTimeoutSerializer(
        data={"booking_ids": [booking_user.id]},
        context={"request": booking_user}
    )

    booking_user.status = "pending_payment"
    booking_user.save()

    assert serializer.is_valid(), serializer.errors
    validated_data = serializer.validated_data

    assert "id" not in validated_data
    assert "user" not in validated_data
    assert "showtime" not in validated_data
    assert "booking_ids" in validated_data


@pytest.mark.django_db
def test_booking_payment_display_serializer(booking_user):
    serializer = BookingPaymentDisplaySerializer(
        data={"booking_ids": [booking_user.id]},
        context={"request": booking_user}
    )

    booking_user.status = "pending_payment"
    booking_user.save()


    assert serializer.is_valid(), serializer.errors
    validated_data = serializer.validated_data

    assert "id" not in validated_data
    assert "user" not in validated_data
    assert "showtime" not in validated_data
    assert "booking_ids" in validated_data


@pytest.mark.django_db
def test_booking_payment_serializer(booking_user):
    serializer = BookingListPaymentSerializer(booking_user)
    data = serializer.data

    assert len(data) == 10

    assert "movie_title" in data
    assert "movie_release" in data
    assert "theater_name" in data
    assert "city_name" in data
    assert "city_address" in data
    assert "showtime_price" in data
    assert "showtime_format" in data
    assert "showtime_presentation" in data
    assert "showtime_starts" in data
    assert "seat" in data


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Payment
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_payment_complete_serializer(payment_user):
    serializer = PaymentCompleteSerializer(payment_user)
    data = serializer.data

    assert len(data) == 7

    assert "id" in data
    assert "user" in data
    assert "@" in data["user"]
    assert "bookings" in data
    assert data["bookings"][0]["showtime"]["movie_title"] == "F1"
    assert data["bookings"][0]["showtime"]["city_name"] == "London"
    assert "seat" not in data
    assert "amount" in data
    assert "method" in data
    assert "status" in data
    assert "paid_at" in data


@pytest.mark.django_db
def test_payment_create_serializer(payment_user):
    data = {
        "booking_ids": list(payment_user.bookings.values_list("id", flat=True)),
        "amount": str(payment_user.amount),
        "method": payment_user.method,
    }
    serializer = PaymentCreateSerializer(data=data)
    assert serializer.is_valid(), serializer.errors

    output = serializer.validated_data
    assert "booking_ids" in output
    assert "amount" in output
    assert "method" in output
    assert "id" not in output
    assert "user" not in output
    assert "status" not in output
    assert "paid_at" not in output
