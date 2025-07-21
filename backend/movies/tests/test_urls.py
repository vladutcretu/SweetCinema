# Django 
from django.urls import resolve, reverse

# App
from ..views import (
    # Movie
    MovieListView,
    MovieStaffListCreateView,
    MovieRetrieveUpdateDestroyView,
)

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# MovieListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_movie_list_resolves():
    match = resolve("/api/v1/movies/")
    assert match.func.view_class == MovieListView

def test_movie_list_reverse():
    assert reverse("read-movies") == "/api/v1/movies/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# MovieStaffListCreateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_movie_staff_list_create_resolves():
    match = resolve("/api/v1/movies/staff/")
    assert match.func.view_class == MovieStaffListCreateView

def test_movie_staff_list_create_reverse():
    assert reverse("create-read-movies") == "/api/v1/movies/staff/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# MovieRetrieveUpdateDestroyView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_movie_retrieve_update_delete_resolves():
    match = resolve("/api/v1/movies/1/")
    assert match.func.view_class == MovieRetrieveUpdateDestroyView

def test_city_list_create_reverse():
    assert reverse("retrieve-update-delete-movies", args=[1]) == "/api/v1/movies/1/"
