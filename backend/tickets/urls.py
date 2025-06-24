from django.urls import path

# App
from .views import BookingCreateReserveView, BookingCreatePaymentView, BookingListView, PaymentListView

# Create your urls here.
urlpatterns = [
    path("reserve/", BookingCreateReserveView.as_view(), name="reserve-create"),
    path("pay/", BookingCreatePaymentView.as_view(), name="pay-create"),
    path("bookings/", BookingListView.as_view(), name="booking-list"),
    path("payments/", PaymentListView.as_view(), name="payment-list"),
]
