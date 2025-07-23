# Django 
from django.urls import resolve, reverse

# App
from ..views import (
    # Booking
    BookingListView,
    BookingUpdateView,
)

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# BookingListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_booking_list_resolves():
    match = resolve("/api/v1/tickets/bookings/")
    assert match.func.view_class == BookingListView

def test_booking_list_reverse():
    assert reverse("read-bookings") == "/api/v1/tickets/bookings/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# BookingUpdateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_booking_update_resolves():
    match = resolve("/api/v1/tickets/bookings/1/")
    assert match.func.view_class == BookingUpdateView

def test_booking_update_reverse():
    assert reverse("update-bookings", args=[1]) == "/api/v1/tickets/bookings/1/"
