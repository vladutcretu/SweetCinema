from django.urls import path

# App
from .views import (
    # User
    MovieShowtimeListView,
    # Other
    ShowtimeListView,
    ShowtimeRetrieveView,
    ShowtimeListStaffView,
    ShowtimeCreateStaffView,
    ShowtimeUpdateDeleteView,
    ShowtimeSeatsListView,
    ShowtimeReportView,
)
# Create your urls here.


urlpatterns = [
    path("", ShowtimeListView.as_view(), name="showtime-list"),
    path("<int:pk>/", ShowtimeRetrieveView.as_view(), name="showtime-retrieve"),
    path("staff/", ShowtimeListStaffView.as_view(), name="showtime-list-staff"),
    path(
        "staff/create/", ShowtimeCreateStaffView.as_view(), name="showtime-create-staff"
    ),
    path(
        "staff/<int:pk>/",
        ShowtimeUpdateDeleteView.as_view(),
        name="showtime-update-delete-staff",
    ),
    path("<int:pk>/seats/", ShowtimeSeatsListView.as_view(), name="showtime-seats"),
    path("<int:pk>/report/", ShowtimeReportView.as_view(), name="showtime-report"),
    # User
    path("movie/", MovieShowtimeListView.as_view(), name="read-movie-showtimes"),
]
