from django.urls import path

# App
from .views import (
    # Genre
    GenreListCreateView,
    GenreUpdateDestroyView,
    # Movie
    MovieListView,
    MovieStaffListCreateView,
    MovieRetrieveUpdateDestroyView,
)

# Create your urls here.


urlpatterns = [
    # Genre
    path("genres/", GenreListCreateView.as_view(), name="create-read-genres"),
    path(
        "genres/<int:id>/",
        GenreUpdateDestroyView.as_view(),
        name="update-delete-genres",
    ),
    # Movie
    path("", MovieListView.as_view(), name="read-movies"),
    path("staff/", MovieStaffListCreateView.as_view(), name="create-read-movies"),
    path(
        "<int:id>/",
        MovieRetrieveUpdateDestroyView.as_view(),
        name="retrieve-update-delete-movies",
    ),
]
