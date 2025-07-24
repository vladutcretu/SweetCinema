# Django 
from django.urls import resolve, reverse

# App
from ..views import (
    # Booking
    BookingListCreateView,
    BookingUpdateView,
    BookingPaymentTimeoutView,
    BookingListPaymentView,
    # Payment
    PaymentListCreateView,
)

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# BookingListCreateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_booking_list_create_resolves():
    match = resolve("/api/v1/tickets/bookings/")
    assert match.func.view_class == BookingListCreateView

def test_booking_list_create_reverse():
    assert reverse("create-read-bookings") == "/api/v1/tickets/bookings/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# BookingUpdateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_booking_update_resolves():
    match = resolve("/api/v1/tickets/bookings/1/")
    assert match.func.view_class == BookingUpdateView

def test_booking_update_reverse():
    assert reverse("update-bookings", args=[1]) == "/api/v1/tickets/bookings/1/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# BookingPaymentTimeoutView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_booking_mark_failed_resolves():
    match = resolve("/api/v1/tickets/bookings/mark-failed/")
    assert match.func.view_class == BookingPaymentTimeoutView

def test_booking_mark_failed_reverse():
    assert reverse("mark-failed-bookings") == "/api/v1/tickets/bookings/mark-failed/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# BookingListPaymentView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_booking_in_payment_resolves():
    match = resolve("/api/v1/tickets/bookings/payments/")
    assert match.func.view_class == BookingListPaymentView

def test_booking_in_payment_reverse():
    assert reverse("read-payment-bookings") == "/api/v1/tickets/bookings/payments/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# PaymentListCreateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_payment_list_create_resolves():
    match = resolve("/api/v1/tickets/payments/")
    assert match.func.view_class == PaymentListCreateView

def test_payment_list_create_reverse():
    assert reverse("create-read-payments") == "/api/v1/tickets/payments/"
