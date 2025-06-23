from django.urls import path

# App
from .views import BookingListView, PaymentListView

# Create your urls here.
urlpatterns = [
    path("bookings/", BookingListView.as_view(), name="booking-list"),
    path("payments/", PaymentListView.as_view(), name="payment-list"),
]
