from django.urls import path

# App
from .views import (
    # City
    CityListCreateView,
    CityUpdateDestroyView,
)

# Create your urls here.

urlpatterns = [
    # City
    path("cities/", CityListCreateView.as_view(), name="create-read-cities"),
    path("cities/<int:id>/", CityUpdateDestroyView.as_view(), name="update-delete-cities"),
]
