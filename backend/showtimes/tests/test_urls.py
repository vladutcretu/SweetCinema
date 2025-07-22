# Django 
from django.urls import resolve, reverse

# App
from ..views import (
    ShowtimeListView,
    ShowtimeStaffListCreateView,
    ShowtimeRetrieveUpdateDestroyView,
    ShowtimeSeatsListView,
    ShowtimeReportRetrieveView
)

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_showtime_list_resolves():
    match = resolve("/api/v1/showtimes/")
    assert match.func.view_class == ShowtimeListView

def test_showtime_list_reverse():
    assert reverse("read-showtimes") == "/api/v1/showtimes/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeStaffListCreateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_showtime_staff_list_create_resolves():
    match = resolve("/api/v1/showtimes/staff/")
    assert match.func.view_class == ShowtimeStaffListCreateView

def test_showtime_list_create_reverse():
    assert reverse("create-read-showtimes") == "/api/v1/showtimes/staff/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeRetrieveUpdateDestroyView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_showtime_retrieve_update_destroy_resolves():
    match = resolve("/api/v1/showtimes/1/")
    assert match.func.view_class == ShowtimeRetrieveUpdateDestroyView

def test_showtime_retrieve_update_destroy_reverse():
    assert reverse("retrieve-update-delete-showtimes", args=[1]) == "/api/v1/showtimes/1/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeSeatsListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_showtime_seats_list_resolves():
    match = resolve("/api/v1/showtimes/1/seats/")
    assert match.func.view_class == ShowtimeSeatsListView

def test_showtime_seats_list_reverse():
    assert reverse("read-showtimes-seats", args=[1]) == "/api/v1/showtimes/1/seats/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# ShowtimeReportRetrieveView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_showtime_report_retrieve_resolves():
    match = resolve("/api/v1/showtimes/1/report/")
    assert match.func.view_class == ShowtimeReportRetrieveView

def test_showtime_report_retrieve_reverse():
    assert reverse("retrieve-showtimes-report", args=[1]) == "/api/v1/showtimes/1/report/"
