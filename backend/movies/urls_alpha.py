from django.urls import path

# App
from .views import (
    GenreListView,
    GenreCreateView,
    GenreUpdateDestroyView,
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
]
