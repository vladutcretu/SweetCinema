# DRF
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny

# App
from .models import Booking, Payment
from .serializers import (
    BookingCreateReserveSerializer,
    BookingSerializer,
    PaymentSerializer,
)

# Create your views here.


class BookingCreateReserveView(CreateAPIView):
    """
    View to create a Booking object with status=reserved using given showtime_id and seat_id.
    Available to any role; required token authentication.
    """

    queryset = Booking.objects.all()
    serializer_class = BookingCreateReserveSerializer
    permission_classes = [IsAuthenticated]


class BookingListView(ListAPIView):
    """
    View to list all Booking objects.
    Available to any role; not required token authentication.
    """

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]


class PaymentListView(ListAPIView):
    """
    View to list all Payment objects.
    Available to any role; not required token authentication.
    """

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]
