from django.urls import path

# App
from .views import GenreListView, MovieListView, MovieRetrieveView

# Create your urls here.


urlpatterns = [
    path("genres/", GenreListView.as_view(), name="genre-list"),
    path("", MovieListView.as_view(), name="movie-list"),
    path("<int:pk>/", MovieRetrieveView.as_view(), name="movie-retrieve"),
]
