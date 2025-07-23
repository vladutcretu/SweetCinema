# Django
from django.db import transaction

# DRF
from rest_framework import generics
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    ListAPIView,
    UpdateAPIView,
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.validators import ValidationError
from rest_framework import status

# 3rd party apps
from drf_spectacular.utils import extend_schema
import django_filters

# App
from .models import Booking, BookingStatus, Payment, PaymentStatus
from .serializers import (
    BookingPartialSerializer,
    BookingCompleteSerializer,
    BookingUpdateSerializer,
    # Other
    BookingSerializer,
    BookingCreateReserveSerializer,
    BookingCreatePaymentSerializer,
    BookingSummaryRequestSerializer,
    BookingsListPaymentSerializer,
    PaymentCreateSerializer,
    PaymentSerializer,
)
from users.permissions import IsManager, IsCashier

# Create your views here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Booking
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@extend_schema(tags=["v1 - Bookings"])
class BookingListView(generics.ListAPIView):
    """
    Available to authenticated users, staff and 'Manager', 'Cashier' group.\n
    GET without query params or param staff=false: list all Booking objects owned.\n
    GET with param staff=true, without param city and 'Manager' group: list all
    Booking objects created by users.\n
    GET with params staff=true, city=city_id and 'Cashier' group: list all
    Booking objects created by users for showtimes in that city.\n
    Response contains expires_at for user instead of updated_at for staff, beside id, 
    showtime (movie title, city and theater names, starts_at), status, booked_at.\n
    """
    
    class BookingFilter(django_filters.FilterSet):
        staff = django_filters.BooleanFilter(method="filter_by_staff")
        city = django_filters.NumberFilter(field_name="showtime__theater__city_id")

        class Meta:
            model = Booking
            fields = ["staff", "city"]

        def filter_by_staff(self, queryset, name, value):
            user = self.request.user

            if value is True:
                if user.is_staff or user.groups.filter(name="Manager").exists():
                    return queryset  # All bookings
                elif user.is_staff or user.groups.filter(name="Cashier").exists():
                    city_id = self.data.get("city")
                    if not city_id:
                        raise ValidationError(
                            {"detail": "City param required for Cashier."}
                        )
                    return queryset.filter(showtime__theater__city_id=city_id) # All bookings in city
                else:
                    raise ValidationError(
                        {"detail": "You are not allowed to access."}
                    )
            elif value is False:
                return queryset.filter(user=user)
            else:
                return queryset.none()
            
    filterset_class = BookingFilter
    permission_classes = [IsAuthenticated]
    queryset = Booking.objects.select_related(
        "user",
        "showtime",
        "showtime__movie",
        "showtime__theater",
        "showtime__theater__city",
        "seat"
    )

    def get_serializer_class(self):
        staff = self.request.query_params.get("staff", "false").lower()
        if staff == "true":
            return BookingCompleteSerializer
        return BookingPartialSerializer
    

@extend_schema(tags=["v1 - Bookings"])
class BookingUpdateView(generics.UpdateAPIView):
    """
    Available to authenticated users, staff and 'Cashier' group to update Booking
    object status to canceled/purchased for object that current status is 'reserved'.\n
    PATCH without query param or param staff=false: user, staff and 'Cashier
    can update his own Booking status to 'canceled'.\n
    PATCH with query param=true: user can not update, while staff / 'Cashier'
    can update others bookings to 'purchased'.\n
    """

    permission_classes = [IsAuthenticated]
    serializer_class = BookingUpdateSerializer
    http_method_names = ["patch"]
    lookup_field = "id"

    def get_queryset(self):
        queryset = Booking.objects.select_related(
            "user",
            "showtime",
            "showtime__movie",
            "showtime__theater",
            "showtime__theater__city",
            "seat"
        )
        staff = self.request.query_params.get("staff", "false").lower()

        if staff == "true":
            if self.request.user.is_staff or self.request.user.groups.filter(name="Cashier").exists():
                return queryset
            else:
                return queryset.none()
        return queryset.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        booking = self.get_object()
        user = self.request.user
        new_status = serializer.validated_data.get("status")

        if booking.status != BookingStatus.RESERVED or booking.expires_at is None:
            raise ValidationError(
                {"detail": "Can only update bookings with status reserved and a non-null expires_at."}
                )

        is_allowed = user.is_staff or user.groups.filter(name="Cashier").exists()
        is_owner = booking.user == user

        if not is_allowed:
            if not is_owner:
                raise ValidationError(
                    {"detail": "You can only update your booking."}
                    )
            elif new_status != BookingStatus.CANCELED:
                raise ValidationError(
                    {"detail": "You can only cancel your booking."}
                )
        else:
            if new_status == BookingStatus.CANCELED and not is_owner:
                    raise ValidationError(
                        {"detail": "You can only cancel your own booking, not others."}
                    )
            elif new_status == BookingStatus.PURCHASED:
                if is_owner:
                    raise ValidationError(
                        {"detail": "You can only cancel your own booking, not purchase."}
                    ) 
            else:
                raise ValidationError(
                    {"detail": "You can only cancel your booking or purchase others user booking."}
                )

        serializer.save(expires_at=None)


# Other
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


class BookingCashierListView(ListAPIView):
    """
    View to list all Bookings objects filtered by City ID.
    Available to `Cashier` role; required token authentication.
    """

    serializer_class = BookingSerializer
    permission_classes = [IsCashier]

    def get_queryset(self):
        city_id = self.request.query_params.get("city")
        if not city_id:
            return Booking.objects.none()

        return Booking.objects.select_related(
            "showtime__movie", "showtime__theater__city", "seat", "user"
        ).filter(showtime__theater__city__id=city_id, status=BookingStatus.RESERVED)


class BookingCashierUpdateView(UpdateAPIView):
    """
    View to update a Booking object requested by ID.
    Available to `Cashier` role; required token authentication.
    """

    queryset = Booking.objects.filter(status=BookingStatus.RESERVED)
    serializer_class = BookingSerializer
    permission_classes = [IsCashier]
    http_method_names = ["patch"]


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
