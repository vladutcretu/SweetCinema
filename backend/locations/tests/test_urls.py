# Django 
from django.urls import resolve, reverse

# App
from ..views import (
    # City
    CityListCreateView,
    CityUpdateDestroyView,
)

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# CityListCreateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_city_list_create_resolves():
    match = resolve("/api/v1/locations/cities/")
    assert match.func.view_class == CityListCreateView

def test_city_list_create_reverse():
    assert reverse("create-read-cities") == "/api/v1/locations/cities/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# CityUpdateDestroyView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

def test_city_update_destroy_resolves():
    match = resolve("/api/v1/locations/cities/1/")
    assert match.func.view_class == CityUpdateDestroyView

def test_city_update_destroy_reverse():
    assert reverse("update-delete-cities", args=[1]) == "/api/v1/locations/cities/1/"
