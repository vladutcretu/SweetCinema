# DRF
from rest_framework import serializers

# App
from .models import Booking, BookingStatus, Payment, PaymentMethod
from showtimes.models import Showtime
from locations.serializers import Seat
from showtimes.serializers import ShowtimeSerializer, ShowtimeBookingSerializer
from locations.serializers import SeatSerializer, SeatBookingSerializer

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Booking
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class BookingPartialSerializer(serializers.ModelSerializer):
    """
    Contains id, FK showtime, FK seat, booked_at, expires_at fields.
    FK showtime contains movie_title, city_name, theater_name, starts_at fields.
    FK seat contains row, column fields.
    """
    showtime = ShowtimeBookingSerializer(read_only=True, many=False)
    seat = SeatBookingSerializer(read_only=True, many=False)
    status = serializers.CharField(source="get_status_display")
    class Meta:
        model = Booking
        fields = [
            "id", 
            "showtime",
            "seat",
            "status",
            "booked_at",
            "expires_at"
        ]

class BookingCompleteSerializer(serializers.ModelSerializer):
    """
    Contains id, FK showtime, FK seat, booked_at, updated_at fields.
    FK showtime contains movie_title, city_name, theater_name, starts_at fields.
    FK seat contains row, column fields.
    """
    user = serializers.CharField(source="user.email")
    showtime = ShowtimeBookingSerializer(read_only=True, many=False)
    seat = SeatBookingSerializer(read_only=True, many=False)
    status = serializers.CharField(source="get_status_display")
    class Meta:
        model = Booking
        fields = [
            "id", 
            "user", 
            "showtime",
            "seat",
            "status",
            "booked_at",
            "updated_at"
        ]

class BookingUpdateSerializer(serializers.ModelSerializer):
    """
    Contains editable fields status, expires_at.
    """
    class Meta:
        model = Booking
        fields = ["status", "expires_at"]


class BookingPaymentSerializer (serializers.ModelSerializer):
    """
    Contains fields id, FK showtime: movie_title, city_name, theater_name, starts_at,
    FK seat: row, column.
    """
    showtime = ShowtimeBookingSerializer(read_only=True, many=False)
    seat = SeatBookingSerializer(read_only=True, many=False)
    class Meta:
        model = Booking
        fields = [
            "id", 
            "showtime",
            "seat"
        ]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Payment
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class PaymentCompleteSerializer(serializers.ModelSerializer):
    """
    Contains id, user email, FK booking (FK showtime: movie_title, city_name, theater_name,
    starts_at, FK seat: row, column), amount, method, status, paid_at fields.
    """
    user = serializers.CharField(source="user.email")
    bookings = BookingPaymentSerializer(read_only=True, many=True)
    paid_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    class Meta:
        model = Payment
        fields = ["id", "user", "bookings", "amount", "method", "status", "paid_at"]

class PaymentCreateSerializer(serializers.ModelSerializer):
    """
    Contains booking_ids (a list with a minimum 1 integer), amount, method fields.
    """
    booking_ids = serializers.ListField(
        child=serializers.IntegerField(write_only=True, min_value=1),
        min_length=1,
        write_only=True,
    )
    amount = serializers.DecimalField(write_only=True, max_digits=8, decimal_places=2)
    method = serializers.ChoiceField(write_only=True, choices=PaymentMethod.choices)

    class Meta:
        model = Payment
        fields = ["booking_ids", "amount", "method"]


# Other
class BookingSerializer(serializers.ModelSerializer):
    showtime = ShowtimeSerializer(read_only=True)
    seat = SeatSerializer(read_only=True)
    booked_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")
    updated_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "showtime",
            "seat",
            "status",
            "booked_at",
            "updated_at",
            "expires_at",
        ]


class BookingCreateReserveSerializer(serializers.ModelSerializer):
    showtime_id = serializers.IntegerField(write_only=True)
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(write_only=True, min_value=0),
        min_length=1,
        max_length=5,
        write_only=True,
    )

    class Meta:
        model = Booking
        fields = ["showtime_id", "seat_ids"]

    def validate(self, data):
        # Get received data values for showtime_id & seat_id
        showtime_id = data["showtime_id"]
        seat_ids = data["seat_ids"]

        # Get Showtime object with received showtime_id or raise error if it doesn't exist
        try:
            showtime = Showtime.objects.get(id=showtime_id)
        except Showtime.DoesNotExist:
            raise serializers.ValidationError("Showtime does not exist")

        for seat_id in seat_ids:
            try:
                # Get Seat object with received seat_id or raise error if it doesn't exist
                seat = Seat.objects.get(id=seat_id)

                # Check if Seat object belong to the Theater linked to the Showtime
                if showtime.theater != seat.theater:
                    raise serializers.ValidationError(
                        "Seat does not belong to the Theater set for this Showtime."
                    )

                # Check if already exists a Booking object with received showtime_id & seat_id objects
                if (
                    Booking.objects.filter(showtime_id=showtime_id, seat_id=seat_id)
                    .exclude(
                        status__in=[
                            BookingStatus.FAILED_PAYMENT,
                            BookingStatus.CANCELED,
                            BookingStatus.EXPIRED,
                        ]
                    )
                    .exists()
                ):
                    raise serializers.ValidationError(
                        "Seat is already reserved or purchased."
                    )
            except Seat.DoesNotExist:
                raise serializers.ValidationError("Seat does not exist.")

        return data


class BookingCreatePaymentSerializer(serializers.ModelSerializer):
    showtime_id = serializers.IntegerField(write_only=True)
    # seat_id = serializers.IntegerField(write_only=True)
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(write_only=True, min_value=0),
        min_length=1,
        write_only=True,
    )

    class Meta:
        model = Booking
        fields = ["showtime_id", "seat_ids"]

    def validate(self, data):
        showtime_id = data["showtime_id"]
        seat_ids = data["seat_ids"]

        try:
            showtime = Showtime.objects.get(id=showtime_id)
        except Showtime.DoesNotExist:
            raise serializers.ValidationError("Showtime does not exist.")

        for seat_id in seat_ids:
            try:
                seat = Seat.objects.get(id=seat_id)
            except Seat.DoesNotExist:
                raise serializers.ValidationError("Seat does not exist.")

            if showtime.theater != seat.theater:
                raise serializers.ValidationError(
                    "Seat does not belong to the Theater set for this Showtime."
                )

            if (
                Booking.objects.filter(showtime_id=showtime_id, seat_id=seat_id)
                .exclude(
                    status__in=[
                        BookingStatus.FAILED_PAYMENT,
                        BookingStatus.CANCELED,
                        BookingStatus.EXPIRED,
                    ]
                )
                .exists()
            ):
                raise serializers.ValidationError(
                    "Seat is already reserved or purchased."
                )

        return data


class BookingSummaryRequestSerializer(serializers.Serializer):
    booking_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1), min_length=1
    )


class BookingsListPaymentSerializer(serializers.ModelSerializer):
    showtime = ShowtimeSerializer(read_only=True)
    seat = SeatSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "showtime", "seat", "status"]


class PaymentSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)
    paid_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Payment
        fields = ["id", "user", "bookings", "amount", "method", "status", "paid_at"]
