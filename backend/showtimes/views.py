# Django
from django.utils import timezone
from django.shortcuts import get_object_or_404

# DRF
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# 3rd party apps
from django_filters.rest_framework import DjangoFilterBackend

# App
from .models import Showtime
from .serializers import ShowtimeSerializer, ShowtimeCreateStaffSerializer
from tickets.models import Booking, BookingStatus
from users.permissions import IsManagerOrEmployee, IsManager
from locations.models import Seat

# Create your views here.


class ShowtimeListView(ListAPIView):
    """
    View to list all Showtime objects requested by Movie ID AND/OR City ID that
    have `date`, `time` value greather than or equal to current `date`, `time` (timezone now).
    Available to any role; not required token authentication.
    """

    queryset = Showtime.objects.filter(starts_at__gte=timezone.now())
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["movie", "theater__city"]


class ShowtimeRetrieveView(RetrieveAPIView):
    """
    View to retrieve a single Showtime object by his ID.
    Available to any role; not required token authentication.
    """

    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]


class ShowtimeListStaffView(ListAPIView):
    """
    View to list all Showtime objects.
    Available to `Manager` or `Employee` role; required token authentication.
    """

    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [IsManagerOrEmployee]


class ShowtimeCreateStaffView(CreateAPIView):
    """
    View to create a Showtime object.
    Available to `Manager` or `Employee` role; required token authentication.
    """

    queryset = Showtime.objects.all()
    serializer_class = ShowtimeCreateStaffSerializer
    permission_classes = [IsManagerOrEmployee]


class ShowtimeUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    View to update and destroy a single Showtime object by his ID.
    Avalaible to `Manager` or `Employee` role; required token authentication.
    """

    queryset = Showtime.objects.all()
    serializer_class = ShowtimeCreateStaffSerializer
    permission_classes = [IsManagerOrEmployee]
    http_method_names = ["patch", "delete"]


class ShowtimeSeatsListView(APIView):
    """
    View to list all Seat objects and their status for a Showtime requested by ID.
    Avalaible to any role; no required token authentication.
    """

    def get(self, request, pk):
        # Get the Showtime object requested by ID (pk)
        showtime = get_object_or_404(Showtime, id=pk)
        # Get the Theater object linked to requested Showtime object
        theater = showtime.theater
        # Get all Seat objects of the Theater linked to requested Showtime object
        seats = theater.seats.all()  # seats is related_name of the Seat-Theater link
        # Get all Booking objects linked to request Showtime object
        bookings = Booking.objects.filter(showtime=showtime).exclude(
            status=BookingStatus.FAILED_PAYMENT
        )
        # Create a dict with key=seat_id of Booking object and value=booking (a Booking object)
        booked_map = {(booking.seat_id): booking for booking in bookings}

        # Start from an empty list and for every Seat object, check if it's exists in Booking objects,
        # then set his status accordingly and add Seat to the list that got returned at the end of iterations
        seat_status_list = []

        for seat in seats:
            booking = booked_map.get(seat.id)

            if (
                not booking
                or booking.status == BookingStatus.FAILED_PAYMENT
                or booking.status == BookingStatus.CANCELED
                or booking.status == BookingStatus.EXPIRED
            ):
                status = "available"
            elif (
                booking.status == BookingStatus.RESERVED
                or booking.status == BookingStatus.PENDING_PAYMENT
            ):
                status = "reserved"
            elif booking.status == BookingStatus.PURCHASED:
                status = "purchased"

            seat_status_list.append(
                {
                    "id": seat.id,
                    "row": seat.row,
                    "column": seat.column,
                    "status": status,
                }
            )

        return Response(seat_status_list)


class ShowtimeReportView(APIView):
    """
    View to retrieve a report about a Showtime requested by ID.
    Avalaible to `Manager` role; required token authentication.
    """

    permission_classes = [IsManager]

    def get(self, request, pk):
        # Get the Showtime object requested by ID (pk)
        showtime = get_object_or_404(Showtime, id=pk)

        # Tickets sold count
        tickets_sold = Booking.objects.filter(
            showtime=showtime, status=BookingStatus.PURCHASED
        ).count()

        # Total revenue
        total_revenue = tickets_sold * showtime.price

        # Room occupancy percentage
        total_seats = Seat.objects.filter(theater=showtime.theater).count()
        occupancy_percentage = round(
            (tickets_sold / total_seats * 100) if total_seats else 0, 2
        )

        # Return calculated data
        return Response(
            {
                "showtime_id": showtime.id,
                "movie": showtime.movie.title,
                "theater": showtime.theater.name,
                "city": showtime.theater.city.name,
                "starts_at": showtime.starts_at,
                "tickets_sold": tickets_sold,
                "total_revenue": total_revenue,
                "occupancy_percentage": occupancy_percentage,
            },
            status=status.HTTP_200_OK,
        )
