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
def movie_superman(genre_action):
    movie = Movie.objects.create(
        title="Superman",
        description=(
            "Superman must reconcile his alien Kryptonian heritage with his human "
            "upbringing as reporter Clark Kent. As the embodiment of truth, "
            "justice and the human way he soon finds himself in a world that views "
            "these as old-fashioned."
        ),
        poster="https://images.google.com",
        director="James Gunn",
        cast="David Corenswet, Rachel Brosnahan, Nicholas Hoult",
        release="2025-07-11",
        duration=timedelta(hours=2, minutes=9),
        parental_guide="restricted",
        language="english",
    )
    movie.genres.add(genre_action)
    return movie


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# City
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.fixture
def city_london():
    return City.objects.create(name="London", address="Street London")

@pytest.fixture
def city_berlin():
    return City.objects.create(name="Berlin", address="Street Berlin")


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
def showtime_superman_london(movie_superman, theater_london):
    return Showtime.objects.create(
        movie=movie_superman,
        theater=theater_london,
        starts_at=timezone.now() + timedelta(days=1)
    )