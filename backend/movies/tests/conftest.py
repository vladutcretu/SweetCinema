# Python / Django
from django.utils import timezone
from datetime import timedelta

# Pytest
import pytest

# App
from movies.models import Genre, Movie
from locations.models import City, Theater
from showtimes.models import Showtime

# Write your fixtures here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Genre
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.fixture
def genres_list():
    return Genre.objects.bulk_create([
        Genre(name="Action"),
        Genre(name="Drama"),
        Genre(name="Thriller"),
    ])

@pytest.fixture
def genre_action():
    return Genre.objects.create(name="Action")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.fixture
def movie_titanic(genre_action):
    movie = Movie.objects.create(
        title="Titanic",
        poster="https://images.google.com"
    )
    movie.genres.add(genre_action)
    return movie


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# City
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.fixture
def city_london():
    return City.objects.create(name="London")

@pytest.fixture
def city_berlin():
    return City.objects.create(name="Berlin")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Theater
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.fixture
def theater_london(city_london):
    return Theater.objects.create(
        name="Room 1",
        city=city_london,
        rows=2,
        columns=4
    )


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Showtime
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.fixture
def showtime_titanic_london(movie_titanic, theater_london):
    return Showtime.objects.create(
        movie=movie_titanic,
        theater=theater_london,
        starts_at=timezone.now() + timedelta(days=1)
    )