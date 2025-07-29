from django.urls import path

# App
from .views import (
    ShowtimeListView,
    ShowtimeStaffListCreateView,
    ShowtimeRetrieveUpdateDestroyView,
    ShowtimeSeatsListView,
    ShowtimeReportRetrieveView,
)

# Create your urls here.


urlpatterns = [
    path("", ShowtimeListView.as_view(), name="read-showtimes"),
    path("staff/", ShowtimeStaffListCreateView.as_view(), name="create-read-showtimes"),
    path(
        "<int:id>/",
        ShowtimeRetrieveUpdateDestroyView.as_view(),
        name="retrieve-update-delete-showtimes",
    ),
    path(
        "<int:id>/seats/", ShowtimeSeatsListView.as_view(), name="read-showtimes-seats"
    ),
    path(
        "<int:id>/report/",
        ShowtimeReportRetrieveView.as_view(),
        name="retrieve-showtimes-report",
    ),
]
