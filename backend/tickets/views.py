# DRF
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

# App
from .models import Booking, Payment
from .serializers import (
    BookingCreateReserveSerializer,
    BookingCreatePaymentSerializer,
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


class BookingCreatePaymentView(CreateAPIView):
    """
    View to create a Booking object with status=pending_payment using given showtime_id and seat_id.
    Available to any role; required token authentication.
    """

    queryset = Booking.objects.all()
    serializer_class = BookingCreatePaymentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Create a serializer instance with serializer_class and requested data
        serializer = self.get_serializer(data=request.data)
        # Validate the serializer and raise error if fails
        serializer.is_valid(raise_exception=True)
        # Call save method from serializer_class
        booking = serializer.save()
        # Send as response the booking.id of newly created object for use in frontend
        return Response({"booking_id": booking.id}, status=status.HTTP_201_CREATED)


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
