from django.urls import path

# App
from .views import (
    # Booking
    BookingListCreateView,
    BookingUpdateView,
    BookingPaymentTimeoutView,
    # Payment
    PaymentListCreateView,
    BookingListPaymentView,
)

# Create your urls here.


urlpatterns = [
    # Booking
    path("bookings/", BookingListCreateView.as_view(), name="read-create-bookings"),
    path("bookings/<int:id>/", BookingUpdateView.as_view(), name="update-bookings"),
    path("bookings/mark-failed/", BookingPaymentTimeoutView.as_view(), name="mark-failed-bookings"),
    path("bookings/payments/", BookingListPaymentView.as_view(), name="read-payment-bookings"),
    # Payment
    path("payments/", PaymentListCreateView.as_view(), name="create-read-payments"),
]
