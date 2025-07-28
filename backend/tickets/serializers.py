# DRF
from rest_framework import serializers

# App
from .models import Booking, BookingStatus, Payment, PaymentMethod
from showtimes.models import Showtime
from locations.models import Seat

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Others
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class ShowtimeBookingSerializer(serializers.ModelSerializer):
    """
    Contains starts_at, FK Movie, City & Theater as movie_title, city_name & theater_name.
    """
    movie_title = serializers.CharField(source="movie.title")
    city_name = serializers.CharField(source="theater.city.name")
    theater_name = serializers.CharField(source="theater.name")
    class Meta:
        model = Showtime
        fields = [
            "movie_title", 
            "city_name", 
            "theater_name", 
            "starts_at"
        ]


class SeatBookingSerializer(serializers.ModelSerializer):
    """
    Include row, column fields.
    """
    class Meta:
        model = Seat
        fields = [
            "row",
            "column"
        ]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Booking
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class BookingPartialSerializer(serializers.ModelSerializer):
    """
    Contains id, FK showtime, FK seat, booked_at, expires_at fields.
    FK showtime contains [movie_title, city_name, theater_name, starts_at] fields.
    FK seat contains [row, column] fields.
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
    FK showtime contains [movie_title, city_name, theater_name, starts_at] fields.
    FK seat contains [row, column] fields.
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


class BookingCreateSerializer(serializers.ModelSerializer):
    """
    Contains showtime_id, seat_ids (list of seats), status fields.
    Receive, validate then create objects with values.
    """
    showtime_id = serializers.IntegerField(write_only=True)
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(write_only=True, min_value=0),
        min_length=1
    )
    status = serializers.ChoiceField(write_only=True, choices=BookingStatus.choices)

    class Meta:
        model = Booking
        fields = [
            "showtime_id", 
            "seat_ids", 
            "status"
        ]

    def validate(self, data):
        showtime_id = data["showtime_id"]
        seat_ids = data["seat_ids"]
        status = data["status"]

        # Status validation
        allowed_statuses = [BookingStatus.RESERVED, BookingStatus.PENDING_PAYMENT]
        if status not in allowed_statuses:
            raise serializers.ValidationError({"status": "Only reserved or pending_payment allowed."})

        # Showtime validation
        try:
            showtime = Showtime.objects.get(id=showtime_id)
        except Showtime.DoesNotExist:
            raise serializers.ValidationError({"showtime_id": "Showtime does not exist."})
        
        # Seats validation
        if data["status"] == BookingStatus.RESERVED and len(seat_ids) > 5:
            raise serializers.ValidationError({"seat_ids": "Maximum 5 seats can be reserved at once."})

        seats = Seat.objects.select_related("theater").filter(id__in=seat_ids)
        if seats.count() != len(seat_ids):
            raise serializers.ValidationError({"seat_ids": "One or more seats do not exist."})
        
        for seat in seats:
            if seat.theater != showtime.theater:
                raise serializers.ValidationError(
                    {"seat_ids": f"Seat {seat.id} does not belong to the correct Theater."}
                )
        
        conflicting = set(Booking.objects
            .filter(showtime=showtime,seat_id__in=seat_ids)
            .exclude(status__in=[BookingStatus.CANCELED, BookingStatus.EXPIRED, BookingStatus.FAILED_PAYMENT])
            .values_list("seat_id", flat=True)
            )
           
        for seat in seats:
            if seat.id in conflicting:
                raise serializers.ValidationError({
                    "seat_ids": f"Seat {seat.id} is already reserved or purchased."
            })
            
        data["seats"] = seats
        data["showtime"] = showtime
        return data
    
    def create(self, validated_data):
        user = self.context["request"].user
        showtime = validated_data["showtime"]
        seats = validated_data["seats"]
        status = validated_data["status"]

        bookings = Booking.objects.bulk_create([
            Booking(user=user, showtime=showtime, seat=seat, status=status) for seat in seats
        ])

        return bookings


class BookingUpdateSerializer(serializers.ModelSerializer):
    """
    Contains editable fields status, expires_at.
    """
    class Meta:
        model = Booking
        fields = [
            "status", 
            "expires_at"
        ]


class BookingPaymentSerializer (serializers.ModelSerializer):
    """
    Contains fields id, FK showtime, FK seat.
    Foreing Key showtime include [movie_title, city_name, theater_name, starts_at].
    Foreign Key seat include [row, column].
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


class BookingPaymentTimeoutSerializer(serializers.Serializer):
    """
    Contains booking_ids (a list with a minimum 1 integer); receive, validate and
    update their Booking objects status and return the objects.
    """
    booking_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1), 
        min_length=1
    )

    def validate(self, data):
        user = self.context["request"].user
        booking_ids = data["booking_ids"]

        # Get Booking objects included in payment
        bookings = (
            Booking.objects
            .filter(
                id__in=booking_ids,
                user=user, 
                status=BookingStatus.PENDING_PAYMENT
            )
        )
        if bookings.count() != len(booking_ids):
            raise serializers.ValidationError({
                "booking_ids": "One or more bookings do not exist, are not yours or are not pending payment."
            })
        
        self._bookings = bookings
        return data
    
    def save(self):
        self._bookings.update(status=BookingStatus.FAILED_PAYMENT)
        return self._bookings


class BookingListPaymentSerializer(serializers.ModelSerializer):
    """
    Contains different foreign keys: movie_title, movie_release, theater_name, 
    city_name, city_address, showtime_price, showtime_format, showtime_presentation,
    showtime_starts, FK seat include [row, column] fields.
    """
    movie_title = serializers.CharField(source="showtime.movie.title")
    movie_release = serializers.DateField(source="showtime.movie.release")

    theater_name = serializers.CharField(source="showtime.theater.name")

    city_name = serializers.CharField(source="showtime.theater.city.name")
    city_address = serializers.CharField(source="showtime.theater.city.address")
    
    showtime_price = serializers.DecimalField(source="showtime.price", max_digits=8, decimal_places=2)
    showtime_format = serializers.CharField(source="showtime.format")
    showtime_presentation = serializers.CharField(source="showtime.presentation")
    showtime_starts = serializers.DateTimeField(source="showtime.starts_at")

    seat = SeatBookingSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "movie_title",
            "movie_release",
            "theater_name",
            "city_name",
            "city_address",
            "showtime_price",
            "showtime_format",
            "showtime_presentation",
            "showtime_starts",
            "seat"
        ]


class BookingPaymentDisplaySerializer(serializers.Serializer):
    """
    Contains bookings ids (a list with a minimum 1 integer); receive, validate, 
    calculate their total price and returns it with the objects itself.
    """
    booking_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1), min_length=1
    )

    def validate_booking_ids(self, booking_ids):
        if not booking_ids:
            raise serializers.ValidationError("List of booking IDs cannot be empty.")
        return booking_ids

    def create(self, validated_data):
        user = self.context["request"].user
        booking_ids = validated_data["booking_ids"]

        # Obține bookings filtrând direct aici
        bookings = (
            Booking.objects
            .filter(id__in=booking_ids, user=user, status=BookingStatus.PENDING_PAYMENT)
            .select_related("showtime__movie", "showtime__theater__city", "seat")
        )

        if bookings.count() != len(booking_ids):
            raise serializers.ValidationError({
                "booking_ids": "One or more bookings do not exist, are not yours or are not pending payment."
            })

        total_price = sum(booking.showtime.price for booking in bookings)

        return bookings, total_price


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Payment
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class PaymentCompleteSerializer(serializers.ModelSerializer):
    """
    Contains id, user email, FK booking (FK showtime: [movie_title, city_name, theater_name,
    starts_at], FK seat: [row, column]), amount, method, status, paid_at fields.
    """
    user = serializers.CharField(source="user.email")
    bookings = BookingPaymentSerializer(read_only=True, many=True)
    method = serializers.CharField(source="get_method_display")
    status = serializers.CharField(source="get_status_display")
    class Meta:
        model = Payment
        fields = [
            "id", 
            "user", 
            "bookings", 
            "amount", 
            "method", 
            "status", 
            "paid_at"
        ]


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
        fields = [
            "booking_ids", 
            "amount", 
            "method"
        ]
