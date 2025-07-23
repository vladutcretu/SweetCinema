from django.urls import path

# App
from .views import (
    # Booking
    BookingListView,
    BookingUpdateView
)

# Create your urls here.


urlpatterns = [
    # Booking
    path("bookings/", BookingListView.as_view(), name="read-bookings"),
    path("bookings/<int:id>/", BookingUpdateView.as_view(), name="update-bookings"),
]
