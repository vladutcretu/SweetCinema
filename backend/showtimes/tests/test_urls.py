# Django 
from django.urls import resolve, reverse

# App
from showtimes.views import (
    MovieShowtimeListView
)

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# MovieShowtimeListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_user_movie_list_resolves():
    match = resolve("/api/showtimes/movie/")
    assert match.func.view_class == MovieShowtimeListView

def test_user_movie_list_reverse():
    assert reverse("read-movie-showtimes") == "/api/showtimes/movie/"
