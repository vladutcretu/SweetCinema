# Django
from django.shortcuts import get_object_or_404
from django.db import transaction

# DRF
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# App
from .models import Booking, BookingStatus, Payment, PaymentStatus
from .serializers import (
    BookingSerializer,
    BookingCreateReserveSerializer,
    BookingCreatePaymentSerializer,
    PaymentCreateSerializer,
)

# Create your views here.


class BookingRetrieveView(RetrieveAPIView):
    """
    View to retrieve a single Booking object by his ID.
    Available to any role; required token authentication.
    """

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]


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


class PaymentCreateView(CreateAPIView):
    """
    View to create a Payment object using given booking_id.
    Payment will have `status=accepted` if amount is the same as booking.showtime.price,
    else will have `status=declined`. Booking status also got updated after Payment object is created.
    Available to any role; required token authentication.
    """

    serializer_class = PaymentCreateSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic  # group Payment & Booking db actions to prevent data loss
    def create(self, request, booking_id):
        booking = get_object_or_404(
            Booking,
            id=booking_id,
            user=request.user,
            status=BookingStatus.PENDING_PAYMENT,
        )

        serializer = PaymentCreateSerializer(
            data=request.data, context={"booking": booking}
        )
        serializer.is_valid(raise_exception=True)

        is_correct_amount = (
            serializer.validated_data["amount"] == booking.showtime.price
        )

        payment = Payment.objects.create(
            user=request.user,
            booking=booking,
            amount=serializer.validated_data["amount"],
            method=serializer.validated_data["method"],
            status=PaymentStatus.ACCEPTED
            if is_correct_amount
            else PaymentStatus.DECLINED,
        )

        if payment.status == PaymentStatus.ACCEPTED:
            booking.status = BookingStatus.PURCHASED
            booking.save()
            return Response(
                {
                    "status": "success",
                    "message": "Payment successfully. Enjoy your show!",
                    "payment_id": payment.id,
                    "booking_status": booking.status,
                },
                status=status.HTTP_201_CREATED,
            )
        elif payment.status == PaymentStatus.DECLINED:
            booking.status = BookingStatus.FAILED_PAYMENT
            booking.save()
            return Response(
                {
                    "status": "error",
                    "message": "Payment declined. Please try to book again!",
                    "payment_id": payment.id,
                    "booking_status": booking.status,
                },
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )
