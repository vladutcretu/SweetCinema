# Django
from django.db import transaction

# DRF
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.validators import ValidationError
from rest_framework import status

# 3rd party apps
from drf_spectacular.utils import extend_schema

# App
from .models import Booking, BookingStatus, Payment, PaymentStatus
from .serializers import (
    # Booking
    BookingPartialSerializer,
    BookingCompleteSerializer,
    BookingCreateSerializer,
    BookingUpdateSerializer,
    BookingPaymentTimeoutSerializer,
    BookingPaymentDisplaySerializer,
    BookingListPaymentSerializer,
    # Payment
    PaymentCompleteSerializer,
    PaymentCreateSerializer,
)
from users.permissions import IsManager

# Create your views here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Booking
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@extend_schema(tags=["v1 - Bookings"])
class BookingListCreateView(generics.ListCreateAPIView):
    """
    Available to authenticated users, staff and 'Manager', 'Cashier' group.\n
    GET without query params or param staff=false: list all Booking objects owned.\n
    GET with param staff=true, without param city and 'Manager' group: list all
    Booking objects created by users.\n
    GET with params staff=true, city=city_id and 'Cashier' group: list all
    Booking objects created by users for showtimes in that city.\n
    Response contains expires_at for user instead of updated_at for staff, beside id, 
    showtime (movie title, city and theater names, starts_at), status, booked_at.\n
    POST: create one or more Booking objects for Seats in a Showtime with specified
    status; only reserved and pending_payment allowed.
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BookingCreateSerializer
        
        staff = self.request.query_params.get("staff", "false").lower()
        if staff == "true":
            return BookingCompleteSerializer
        return BookingPartialSerializer
    
    def get_queryset(self):
        user = self.request.user
        staff_param = self.request.query_params.get("staff", "false").lower()
        is_allowed = staff_param == "true"

        queryset = Booking.objects.select_related(
            "user",
            "showtime",
            "showtime__movie",
            "showtime__theater",
            "showtime__theater__city",
            "seat"
        )

        if is_allowed:
            if user.is_staff or user.groups.filter(name="Manager").exists():
                return queryset
            elif user.is_staff or user.groups.filter(name="Cashier").exists():
                city_id = self.request.query_params.get("city")
                if not city_id:
                    raise ValidationError({"detail": "City param required for Cashier."})
                return queryset.filter(
                    showtime__theater__city_id=city_id, status=BookingStatus.RESERVED
                )
            else:
                raise ValidationError({"detail": "You are not allowed to access."})
        else:
            return queryset.filter(user=user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        bookings = serializer.save()
        booking_ids = [booking.id for booking in bookings]

        return Response({"booking_ids": booking_ids}, status=status.HTTP_201_CREATED)


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
            if new_status == BookingStatus.CANCELED:
                if not is_owner:
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


@extend_schema(tags=["v1 - Bookings"])
class BookingPaymentTimeoutView(APIView):
    """
    Available to authenticated users to update Booking objects status to 
    'failed_payment' for objects that current status is 'pending_payment'.\n
    `Info:` while /bookings/:id/ is build to be interactive for user/staff,
    this endpoint's scope is fallback when the user do not complete
    the payment in given time, abandon the page etc.\n
    """

    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = BookingPaymentTimeoutSerializer(
            data=request.data, 
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        bookings = serializer.save()
        return Response(
            {"success": "Bookings status got updated to failed_payment!"},
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=["v1 - Bookings"])
class BookingListPaymentView(APIView):
    """
    Available to authenticated users.\n
    POST: list Booking objects given their list of IDs.\n
    """
    def post(self, request):
        serializer = BookingPaymentDisplaySerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        bookings, total_price = serializer.create(validated_data=serializer.validated_data)
        return Response(
            {
                "bookings": BookingListPaymentSerializer(bookings[0], many=False).data,
                "total_price": total_price,
            },
            status=status.HTTP_200_OK,
        )


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Payments
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@extend_schema(tags=["v1 - Payments"])
class PaymentListCreateView(generics.ListCreateAPIView):
    """
    GET: list all Payment objects; available to staff / 'Manager' group.\n
    POST: create a Payment object for single or multiple Booking objects; available to anyone.\n
    Receives a list of booking_ids, amount (sum paid by user) and method.
    Sums the prices of every showtime included in bookings,compare to amount value, and set the
    Payment status to accepted / declined, then for the Bookings as well.\n
    """

    queryset = (
        Payment.objects
        .select_related("user")
        .prefetch_related("bookings", "bookings__showtime", "bookings__seat")
    )

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [IsManager()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PaymentCreateSerializer
        return PaymentCompleteSerializer
    
    @transaction.atomic
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        booking_ids = serializer.validated_data["booking_ids"]
        amount = serializer.validated_data["amount"]
        method = serializer.validated_data["method"]

        bookings = self.get_bookings(booking_ids, user)
        if bookings is None:
            return self.build_reponse_invalid()
        
        total_price = self.get_total_price(bookings)
        payment_status = self.get_payment_status(amount, total_price)
        payment = self.create_payment(user, amount, method, payment_status, bookings)
        self.update_booking_status(bookings, payment_status)
        return self.build_reponse_success(payment, bookings)

    def get_bookings(self, booking_ids, user):
        bookings = Booking.objects.filter(
                id__in=booking_ids, 
                user=user, 
                status=BookingStatus.PENDING_PAYMENT
            )
        if bookings.count() == len(booking_ids):
            return bookings
        return None
        
    def get_total_price(self, bookings):
        return sum(booking.showtime.price for booking in bookings)

    def get_payment_status(self, amount, expected_total):
        return (
            PaymentStatus.ACCEPTED 
            if amount == expected_total
            else PaymentStatus.DECLINED 
        )
    
    def create_payment(self, user, amount, method, status, bookings):
        payment = Payment.objects.create(
            user=user,
            amount=amount,
            method=method,
            status=status,
        )
        payment.bookings.set(bookings)
        return payment
    
    def update_booking_status(self, bookings, payment_status):
        new_status = (
            BookingStatus.PURCHASED
            if payment_status == PaymentStatus.ACCEPTED
            else BookingStatus.FAILED_PAYMENT
        )
        for booking in bookings:
            booking.status = new_status
            booking.save()

    def build_reponse_success(self, payment, bookings):
        is_success = payment.status == PaymentStatus.ACCEPTED
        return Response(
            {
                "status": "success" if is_success else "error",
                "message": "Payment processed.",
                "payment_id": payment.id,
                "booking_statuses": [
                    {"booking_id": booking.id, "status": booking.status}
                    for booking in bookings
                ],
            },
            status=status.HTTP_201_CREATED 
            if is_success
            else status.HTTP_402_PAYMENT_REQUIRED,
        )
    
    def build_reponse_invalid(self):
        return Response(
            {
                "error": "One or more bookings not found or not eligible for payment."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
