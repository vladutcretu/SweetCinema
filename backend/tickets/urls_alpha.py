from django.urls import path

# App
from .views import (
    BookingCreateReserveView,
    BookingCreatePaymentView,
    PaymentCreateView,
    BookingUpdateStatusView,
    BookingListPaymentView,
    PaymentListView,
)

# Create your urls here.


urlpatterns = [
    path("reserve/", BookingCreateReserveView.as_view(), name="reserve-create"),
    path("purchase/", BookingCreatePaymentView.as_view(), name="pay-create"),
    path("pay/", PaymentCreateView.as_view(), name="payment-create"),
    path("pay/timeout/", BookingUpdateStatusView.as_view(), name="payment-timeout"),
    path(
        "pay/bookings/", BookingListPaymentView.as_view(), name="payment-bookings-list"
    ),
    path("payments/", PaymentListView.as_view(), name="payments-list"),
]
