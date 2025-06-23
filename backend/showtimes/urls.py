from django.urls import path

# App
from .views import ShowtimeListView, ShowtimeRetrieveView, ShowtimeSeatsListView

# Create your urls here.


urlpatterns = [
    path("", ShowtimeListView.as_view(), name="showtime-list"),
    path("<int:pk>/", ShowtimeRetrieveView.as_view(), name="showtime-retrieve"),
    path("<int:pk>/seats/", ShowtimeSeatsListView.as_view(), name="showtime-seats"),
]
