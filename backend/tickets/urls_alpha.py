from django.urls import path

# App
from .views import (
    BookingCreateReserveView,
    BookingCreatePaymentView,
    BookingUpdateStatusView,
    BookingListPaymentView,
)

# Create your urls here.


urlpatterns = [
    path("reserve/", BookingCreateReserveView.as_view(), name="reserve-create"),
    path("purchase/", BookingCreatePaymentView.as_view(), name="pay-create"),
    path("pay/timeout/", BookingUpdateStatusView.as_view(), name="payment-timeout"),
    path(
        "pay/bookings/", BookingListPaymentView.as_view(), name="payment-bookings-list"
    ),
]
