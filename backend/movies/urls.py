from django.urls import path

# App
from .views import (
    # Movie - User
    UserMovieListView,
    UserMovieRetrieveView,
    # Other
    GenreListView,
    GenreCreateView,
    GenreUpdateDestroyView,
    MovieListView,
    MovieCreateView,
    MovieUpdateDestroyView,
)

# Create your urls here.


urlpatterns = [
    path("genres/", GenreListView.as_view(), name="genre-list"),
    path("genres/create/", GenreCreateView.as_view(), name="genre-create"),
    path(
        "genres/<int:pk>/",
        GenreUpdateDestroyView.as_view(),
        name="genre-update-destroy",
    ),
    path("", MovieListView.as_view(), name="movie-list"),
    path("create/", MovieCreateView.as_view(), name="movie-create"),
    path(
        "movie/<int:pk>/", MovieUpdateDestroyView.as_view(), name="movie-update-destroy"
    ),
    # Movie - User
    path("user/", UserMovieListView.as_view(), name="user-read-movies"),
    path("<int:id>/", UserMovieRetrieveView.as_view(), name="user-read-movie"),
]
