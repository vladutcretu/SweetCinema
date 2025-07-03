from django.urls import path

# App
from .views import (
    BookingCreateReserveView,
    BookingCreatePaymentView,
    BookingRetrieveView,
    PaymentCreateView,
    BookingUpdateStatusView,
    BookingListPaymentView,
    BoookingListView,
    BookingUserListView,
    BookingUserUpdateView,
    PaymentListView,
)

# Create your urls here.


urlpatterns = [
    path("reserve/", BookingCreateReserveView.as_view(), name="reserve-create"),
    path("purchase/", BookingCreatePaymentView.as_view(), name="pay-create"),
    path("booking/<int:pk>/", BookingRetrieveView.as_view(), name="booking-detail"),
    path("pay/", PaymentCreateView.as_view(), name="payment-create"),
    path("pay/timeout/", BookingUpdateStatusView.as_view(), name="payment-timeout"),
    path(
        "pay/bookings/", BookingListPaymentView.as_view(), name="payment-bookings-list"
    ),
    path("bookings/", BoookingListView.as_view(), name="bookings-list"),
    path("bookings/history/", BookingUserListView.as_view(), name="bookings-history"),
    path(
        "booking/<int:pk>/cancel/",
        BookingUserUpdateView.as_view(),
        name="booking-update",
    ),
    path("payments/", PaymentListView.as_view(), name="payments-list"),
]
