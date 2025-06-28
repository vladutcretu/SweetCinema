from django.urls import path

# App
from .views import CityListView, CityCreateView, CityUpdateDestroy, TheaterListView, TheaterRetrieveView, SeatListView

# Create your urls here.


urlpatterns = [
    path("cities/", CityListView.as_view(), name="city-list"),
    path("cities/create/", CityCreateView.as_view(), name="city-create"),
    path("cities/<int:pk>/", CityUpdateDestroy.as_view(), name="city-update-destroy"),
    path("theaters/", TheaterListView.as_view(), name="theater-list"),
    path("theaters/<int:pk>/", TheaterRetrieveView.as_view(), name="theater-retrieve"),
    path("seats/", SeatListView.as_view(), name="seat-list"),
]
