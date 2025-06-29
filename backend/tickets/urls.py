from django.urls import path

# App
from .views import (
    BookingCreateReserveView,
    BookingCreatePaymentView,
    BookingRetrieveView,
    PaymentCreateView,
    BoookingListView,
    PaymentListView,
)

# Create your urls here.
urlpatterns = [
    path("reserve/", BookingCreateReserveView.as_view(), name="reserve-create"),
    path("pay/", BookingCreatePaymentView.as_view(), name="pay-create"),
    path("booking/<int:pk>/", BookingRetrieveView.as_view(), name="booking-detail"),
    path("pay/<int:booking_id>/", PaymentCreateView.as_view(), name="payment-create"),
    path("bookings/", BoookingListView.as_view(), name="bookings-list"),
    path("payments/", PaymentListView.as_view(), name="payments-list"),
]
