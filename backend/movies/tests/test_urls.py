# Django 
from django.urls import resolve, reverse

# App
from movies.views import UserMovieListView

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserMovieListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_user_movie_list_resolves():
    match = resolve("/api/movies/user/")
    assert match.func.view_class == UserMovieListView

def test_user_movie_list_reverse():
    assert reverse("user-read-movies") == "/api/movies/user/"
