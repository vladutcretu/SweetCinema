# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient

# Pytest
import pytest

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserMovieListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_user_movie_list_view_missing_city_param():
    """ City has not been provided in url """
    client = APIClient()
    url = reverse("user-read-movies")
    response = client.get(url)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "City param is needed: include ?city=city_id in the URL!"

@pytest.mark.django_db
def test_user_movie_list_view_1_result(city_london, showtime_titanic_london):
    """ City provided has 1 active showtime """
    client = APIClient()
    url = reverse("user-read-movies")
    response = client.get(url, {"city": city_london.id})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Titanic"
    assert data[0]["poster"] == "https://images.google.com"
    assert data[0]["genres"][0]["name"] == "Action"

@pytest.mark.django_db
def test_user_movie_list_view_0_result(city_berlin, showtime_titanic_london):
    """ City provided has 0 active showtime """
    client = APIClient()
    url = reverse("user-read-movies")
    response = client.get(url, {"city": city_berlin.id})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0
    assert data == []
