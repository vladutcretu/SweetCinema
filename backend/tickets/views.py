# Django
from django.db import transaction

# DRF
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    ListAPIView,
    UpdateAPIView,
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# App
from .models import Booking, BookingStatus, Payment, PaymentStatus
from .serializers import (
    BookingSerializer,
    BookingCreateReserveSerializer,
    BookingCreatePaymentSerializer,
    BookingSummaryRequestSerializer,
    BookingsListPaymentSerializer,
    PaymentCreateSerializer,
    PaymentSerializer,
)
from users.permissions import IsManager

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

    serializer_class = BookingCreateReserveSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Serialize data and validate
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get validated data for context
        user = request.user
        showtime_id = serializer.validated_data["showtime_id"]
        seat_ids = serializer.validated_data["seat_ids"]

        # Create booking instances from validated data
        bookings = []
        for seat_id in seat_ids:
            booking = Booking.objects.create(
                user=user,
                showtime_id=showtime_id,
                seat_id=seat_id,
                status=BookingStatus.RESERVED,
            )
            bookings.append(booking)

        # Send as response the Booking created instances for being used in frontend
        return Response(
            BookingSerializer(bookings, many=True).data, status=status.HTTP_201_CREATED
        )


class BookingCreatePaymentView(CreateAPIView):
    """
    View to create a Booking object with status=pending_payment using given showtime_id and seat_id.
    Available to any role; required token authentication.
    """

    serializer_class = BookingCreatePaymentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Serialize data and validate
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get validated data for context
        user = request.user
        showtime_id = serializer.validated_data["showtime_id"]
        seat_ids = serializer.validated_data["seat_ids"]

        # Create booking instances from validated data
        bookings = []
        for seat_id in seat_ids:
            booking = Booking.objects.create(
                user=user,
                showtime_id=showtime_id,
                seat_id=seat_id,
                status=BookingStatus.PENDING_PAYMENT,
            )
            bookings.append(booking)

        # Send as response the Booking created instances for being used in frontend
        return Response(
            {"booking_ids": [booking.id for booking in bookings]},
            status=status.HTTP_201_CREATED,
        )


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
    def create(self, request):
        # Serialize data and validate
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get validated data for context
        user = request.user
        booking_ids = serializer.validated_data["booking_ids"]
        amount = serializer.validated_data["amount"]
        method = serializer.validated_data["method"]

        # Get only the Booking instances created in the previously transaction
        bookings = Booking.objects.filter(
            id__in=booking_ids, user=user, status=BookingStatus.PENDING_PAYMENT
        )
        if bookings.count() != len(booking_ids):
            return Response(
                {
                    "error": "One or more bookings not found or not eligible for payment."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate total price for the tickets and validate the transaction
        total_price = sum(booking.showtime.price for booking in bookings)
        payment_status = (
            PaymentStatus.ACCEPTED if amount == total_price else PaymentStatus.DECLINED
        )

        # Create a single Payment instance for multiple Bookings
        payment = Payment.objects.create(
            user=request.user,
            amount=amount,
            method=method,
            status=payment_status,
        )
        payment.bookings.set(bookings)

        # Update Booking status accordingly to Payment status
        for booking in bookings:
            booking.status = (
                BookingStatus.PURCHASED
                if payment_status == PaymentStatus.ACCEPTED
                else BookingStatus.FAILED_PAYMENT
            )
            booking.save()

        # Send response depending on payment status
        return Response(
            {
                "status": "success"
                if payment_status == PaymentStatus.ACCEPTED
                else "error",
                "message": "Payment processed.",
                "payment_id": payment.id,
                "booking_statuses": [
                    {"booking_id": booking.id, "status": booking.status}
                    for booking in bookings
                ],
            },
            status=status.HTTP_201_CREATED
            if payment_status == PaymentStatus.ACCEPTED
            else status.HTTP_402_PAYMENT_REQUIRED,
        )


class BookingListPaymentView(APIView):
    """
    View to list all Bookings objects included in a Payment.
    Available to any role; required token authentication.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Serialize data and validate
        serializer = BookingSummaryRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get validated data for context
        user = request.user
        booking_ids = serializer.validated_data["booking_ids"]

        # Get Booking objects included in payment
        bookings = Booking.objects.filter(id__in=booking_ids, user=user).select_related(
            "showtime__movie", "showtime__theater__city", "seat"
        )
        if bookings.count() != len(booking_ids):
            return Response(
                {
                    "error": "One or more bookings not found or not eligible for payment."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate total price for the tickets
        total_price = sum(booking.showtime.price for booking in bookings)

        # Send response depending on payment status
        return Response(
            {
                "bookings": BookingsListPaymentSerializer(bookings, many=True).data,
                "total_price": total_price,
            },
            status=status.HTTP_200_OK,
        )
    

class BookingUpdateStatusView(APIView):
    """
    View to update a Booking status to `failed_payment` if user failed to complete the transaction.
    Available to any role; required token authentication.
    """

    permission_classes = [IsAuthenticated]

    def put(self, request):
        # Serialize data and validate
        serializer = BookingSummaryRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get validated data for context
        user = request.user
        booking_ids = serializer.validated_data["booking_ids"]

        # Get Booking objects included in payment
        bookings = Booking.objects.filter(
            id__in=booking_ids, user=user, status=BookingStatus.PENDING_PAYMENT
        )
        if bookings.count() != len(booking_ids):
            return Response(
                {
                    "error": "One or more bookings not found or not eligible for update to failed_payment."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        bookings.update(status=BookingStatus.FAILED_PAYMENT)
        return Response(
            {"success": "Bookings status got updated to failed_payment!"},
            status=status.HTTP_200_OK,
        )


class BoookingListView(ListAPIView):
    """
    View to list all Bookings objects.
    Available to `Manager` role; required token authentication.
    """

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsManager]


class BookingUserListView(ListAPIView):
    """
    View to list all Bookings objects owned by requested user.
    Available to any role; required token authentication.
    """

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Queryset retrieve only the objects owned by requested user.
        """
        return Booking.objects.filter(user=self.request.user)


class BookingUserUpdateView(UpdateAPIView):
    """
    View to update a Booking object requested by ID.
    Available to any role; required token authentication.
    """

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_queryset(self):
        """
        Queryset retrieve only the objects owned by requested user.
        """
        return Booking.objects.filter(user=self.request.user)


class PaymentListView(ListAPIView):
    """
    View to list all Payments objects.
    Available to `Manager` role; required token authentication.
    """

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsManager]
