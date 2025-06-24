from django.urls import path

# App
from .views import BookingCreateReserveView, BookingListView, PaymentListView

# Create your urls here.
urlpatterns = [
    path("reserve/", BookingCreateReserveView.as_view(), name="reserve-create"),
    path("bookings/", BookingListView.as_view(), name="booking-list"),
    path("payments/", PaymentListView.as_view(), name="payment-list"),
]
