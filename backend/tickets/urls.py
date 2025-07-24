from django.urls import path

# App
from .views import (
    # Booking
    BookingListView,
    BookingUpdateView,
    # Payment
    PaymentListCreateView
)

# Create your urls here.


urlpatterns = [
    # Booking
    path("bookings/", BookingListView.as_view(), name="read-bookings"),
    path("bookings/<int:id>/", BookingUpdateView.as_view(), name="update-bookings"),
    # Payment
    path("payments/", PaymentListCreateView.as_view(), name="create-read-payments")
]
