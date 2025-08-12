# Django
from django.utils import timezone
from django.db.models import Prefetch

# DRF
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.filters import OrderingFilter

# 3rd party apps
from drf_spectacular.utils import extend_schema
import django_filters
from django_filters.rest_framework import DjangoFilterBackend

# App
from .models import Showtime
from .serializers import (
    ShowtimePartialSerializer,
    ShowtimeMoviePartialSerializer,
    ShowtimeCompleteSerializer,
    ShowtimeCreateUpdateSerializer,
    ShowtimeRetrieveSerializer,
    ShowtimeSeatStatusSerializer,
    ShowtimeReportSerializer,
)
from users.permissions import IsManagerOrPlanner, IsManager
from tickets.models import Booking, BookingStatus
from movies.models import Genre
from locations.models import Seat
from backend.helpers import StandardPagination

# Create your views here.


@extend_schema(tags=["v1 - Showtimes"])
class ShowtimeListView(generics.ListAPIView):
    """
    GET: list all future Showtime objects (starts_at > now), filtered by City and optionally Movie.\n
    Response is different without movie param (include movie details).
    """

    class ShowtimeFilter(django_filters.FilterSet):
        city = django_filters.NumberFilter(field_name="theater__city_id")
        movie = django_filters.NumberFilter(field_name="movie_id")

        class Meta:
            model = Showtime
            fields = ["city", "movie"]

    filter_backends = [DjangoFilterBackend]
    filterset_class = ShowtimeFilter
    permission_classes = [AllowAny]
    queryset = (
        Showtime.objects.filter(starts_at__gte=timezone.now())
        .select_related("movie", "theater", "theater__city")
        .prefetch_related(
            Prefetch("movie__genres", queryset=Genre.objects.only("id", "name"))
        )
        .order_by("starts_at")
    )

    def get_serializer_class(self):
        params = self.request.query_params
        if params.get("city") and params.get("movie"):
            return ShowtimePartialSerializer
        elif params.get("city"):
            return ShowtimeMoviePartialSerializer
        else:
            raise ValidationError({"detail": "Missing param city on query string."})


@extend_schema(tags=["v1 - Showtimes"])
class ShowtimeStaffListCreateView(generics.ListCreateAPIView):
    """
    Only available to staff or 'Manager', 'Planner' role.\n
    GET: list all Showtime objects (all fields).\n
    POST: create Showtime object (all editable fields).\n
    Ordering by id - default, movie, theater (city name),
    created_at, updated_at with standard pagination.\n
    """

    permission_classes = [IsManagerOrPlanner]
    queryset = Showtime.objects.select_related("movie", "theater", "theater__city")
    filter_backends = [OrderingFilter]
    ordering_fields = ["id", "movie", "theater", "created_at", "updated_at"]
    ordering = ["-id"]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ShowtimeCreateUpdateSerializer
        return ShowtimeCompleteSerializer


@extend_schema(tags=["v1 - Showtimes"])
class ShowtimeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: retrieve Showtime object (id, movie_name, theater - name, columns, all editable fields).\n
    PATCH: partial update Showtime object, available to staff or 'Manager', 'Planner' role.\n
    DELETE: delete Showtime object, available to staff or 'Manager', 'Planner' role.\n
    """

    queryset = Showtime.objects.select_related("movie", "theater", "theater__city")
    lookup_field = "id"
    http_method_names = ["get", "patch", "delete"]

    def get_permissions(self):
        if self.request.method in ["PATCH", "DELETE"]:
            return [IsManagerOrPlanner()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ShowtimeRetrieveSerializer
        return ShowtimeCreateUpdateSerializer


@extend_schema(tags=["v1 - Showtimes"])
class ShowtimeSeatsListView(generics.ListAPIView):
    """
    GET: list all Seat objects (id, row, column, status fields) assigned to a Showtime.\n
    """

    serializer_class = ShowtimeSeatStatusSerializer

    def get_queryset(self):
        showtime_id = self.kwargs.get("id")

        try:
            self.showtime = (
                Showtime.objects.select_related("theater")
                .prefetch_related("theater__seats")
                .get(id=showtime_id)
            )
        except Showtime.DoesNotExist:
            raise NotFound(detail=f"Showtime with ID {showtime_id} not found.")

        bookings = (
            Booking.objects.filter(showtime=self.showtime)
            .exclude(
                status__in=[
                    BookingStatus.CANCELED,
                    BookingStatus.EXPIRED,
                    BookingStatus.FAILED_PAYMENT,
                ]
            )
            .only("seat_id", "status", "booked_at", "id")
            .order_by("seat_id", "-booked_at")
        )

        self.bookings_map = {}
        for booking in bookings:
            if booking.seat_id not in self.bookings_map:
                self.bookings_map[booking.seat_id] = booking

        return self.showtime.theater.seats.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        def booking_status(seat_id):
            booking = self.bookings_map.get(seat_id)
            if booking and booking.status == BookingStatus.PURCHASED:
                return "purchased"
            elif booking and booking.status in (
                BookingStatus.RESERVED,
                BookingStatus.PENDING_PAYMENT,
            ):
                return "reserved"
            else:  # no booking, or status = canceled, expired, failed_payment
                return "available"

        seat_status_data = [
            {
                "id": seat.id,
                "row": seat.row,
                "column": seat.column,
                "status": booking_status(seat.id),
            }
            for seat in queryset
        ]

        return Response(seat_status_data)


@extend_schema(tags=["v1 - Showtimes"])
class ShowtimeReportRetrieveView(generics.RetrieveAPIView):
    """
    Available to Staff or 'Manager' role.\n
    GET: retrieve statistics of a specific Showtime.\n
    """

    permission_classes = [IsManager]
    serializer_class = ShowtimeReportSerializer

    def get_queryset(self):
        showtime_id = self.kwargs.get("id")

        try:
            self.showtime = Showtime.objects.select_related(
                "movie", "theater", "theater__city"
            ).get(id=showtime_id)
        except Showtime.DoesNotExist:
            raise NotFound(detail=f"Showtime with ID {showtime_id} not found.")

        return self.showtime

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        def tickets_sold(showtime):
            return Booking.objects.filter(
                showtime=showtime, status=BookingStatus.PURCHASED
            ).count()

        def total_revenue(showtime):
            return tickets_sold(showtime) * showtime.price

        def occupancy_percentage(showtime):
            total_seats = Seat.objects.filter(theater=showtime.theater).count()
            return round(
                (tickets_sold(showtime) / total_seats * 100) if total_seats else 0, 2
            )

        return Response(
            {
                "showtime_id": queryset.id,
                "movie_title": queryset.movie.title,
                "city_name": queryset.theater.city.name,
                "theater_name": queryset.theater.name,
                "starts_at": queryset.starts_at,
                "tickets_sold": tickets_sold(queryset),
                "total_revenue": total_revenue(queryset),
                "occupancy_percentage": occupancy_percentage(queryset),
            }
        )
