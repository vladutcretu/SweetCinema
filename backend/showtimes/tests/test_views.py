# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient

# Pytest
import pytest

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# MovieShowtimeListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_showtime_list_view_missing_params():
    """ Movie and City has not been provided in url """
    client = APIClient()
    url = reverse("read-movie-showtimes")
    response = client.get(url)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Movie and City params are needed: include ?movie=movie_id&city=city_id in the URL!"

@pytest.mark.django_db
def test_movie_showtime_list_view_missing_movie_param(city_london):
    """ Movie and City has not been provided in url """
    client = APIClient()
    url = reverse("read-movie-showtimes")
    response = client.get(url, {"city": city_london.id})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Movie and City params are needed: include ?movie=movie_id&city=city_id in the URL!"

@pytest.mark.django_db
def test_movie_showtime_list_view_missing_city_param(movie_superman):
    """ Movie and City has not been provided in url """
    client = APIClient()
    url = reverse("read-movie-showtimes")
    response = client.get(url, {"movie": movie_superman.id})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Movie and City params are needed: include ?movie=movie_id&city=city_id in the URL!"

@pytest.mark.django_db
def test_user_movie_list_view_1_result(movie_superman, city_london, showtime_superman_london):
    """ Movie and City provided has 1 active showtime """
    client = APIClient()
    url = reverse("read-movie-showtimes")
    response = client.get(url, {"movie": movie_superman.id, "city": city_london.id})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["theater_name"] == showtime_superman_london.theater.name


@pytest.mark.django_db
def test_user_movie_list_view_0_result(movie_superman, city_berlin, showtime_superman_london):
    """ Movie and City provided has 0 active showtime """
    client = APIClient()
    url = reverse("read-movie-showtimes")
    response = client.get(url, {"movie": movie_superman.id, "city": city_berlin.id})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0
    assert data == []
