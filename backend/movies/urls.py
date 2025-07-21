from django.urls import path

# App
from .views import (
    # Movie
    MovieListView,
    MovieStaffListCreateView,
    MovieRetrieveUpdateDestroyView,
)

# Create your urls here.


urlpatterns = [
    # Movie
    path("", MovieListView.as_view(), name="read-movies"),
    path("staff/", MovieStaffListCreateView.as_view(), name="create-read-movies"),
    path("<int:id>/", MovieRetrieveUpdateDestroyView.as_view(), name="retrive-update-delete-movies"),
]