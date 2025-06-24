# DRF
from rest_framework import serializers

# App
from .models import Booking, BookingStatus, Payment
from showtimes.models import Showtime
from locations.serializers import Seat

# Create your serializers here.


class BookingCreateReserveSerializer(serializers.ModelSerializer):
    showtime_id = serializers.IntegerField(write_only=True)
    seat_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = ["showtime_id", "seat_id"]

    def validate(self, data):
        # Get received data values for showtime_id & seat_id
        showtime_id = data["showtime_id"]
        seat_id = data["seat_id"]

        # Get Showtime object with received showtime_id or raise error if it doesn't exist
        try:
            showtime = Showtime.objects.get(id=showtime_id)  # noqa: F841
        except Showtime.DoesNotExist:
            raise serializers.ValidationError("Showtime does not exist")

        # Get Seat object with received seat_id or raise error if it doesn't exist
        try:
            seat = Seat.objects.get(id=seat_id)  # noqa: F841
        except Seat.DoesNotExist:
            raise serializers.ValidationError("Seat does not exist.")

        # Check if Seat object belong to the Theater linked to the Showtime
        if showtime.theater != seat.theater:
            raise serializers.ValidationError(
                "Seat does not belong to the Theater set for this Showtime."
            )

        # Check if already exists a Booking object with received showtime_id & seat_id objects
        if Booking.objects.filter(showtime_id=showtime_id, seat_id=seat_id).exists():
            raise serializers.ValidationError("Seat is already reserved or purchased.")

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        return Booking.objects.create(
            user=user,
            showtime_id=validated_data["showtime_id"],
            seat_id=validated_data["seat_id"],
            status=BookingStatus.RESERVED,
        )


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "user", "showtime", "seat", "status", "booked_at", "updated_at"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "booking", "amount", "method", "status", "paid_at"]
