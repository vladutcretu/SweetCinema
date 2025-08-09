# Django
from django.utils import timezone
from datetime import timedelta

# Pytest
import pytest

# App
from ..models import Genre, Movie
from locations.models import City, Theater
from showtimes.models import Showtime
from users.models import User

# Write your fixtures here.


@pytest.fixture
def genres_list():
    return Genre.objects.bulk_create(
        [Genre(name="Thriller"), Genre(name="Comedy"), Genre(name="Drama")]
    )


@pytest.fixture
def genre_action():
    return Genre.objects.create(name="Action")


@pytest.fixture
def movies_list(genres_list):
    movie1 = Movie.objects.create(
        title="Superman",
        description="Superman desc",
        poster="images.com",
        director="James Gunn",
        cast="David Corenswet, Rachel Brosnahan, Nicholas Hoult",
        release="2025-07-11",
        duration=timedelta(hours=2, minutes=9),
        parental_guide="restricted",
        language="english",
    )
    movie2 = Movie.objects.create(
        title="Jurassic",
        description="Jurassic desc",
        poster="images.net",
        director="Gareth Edwards",
        cast="Scarlett Johansson, Mahershala Ali, Jonathan Bailey",
        release="2025-07-02",
        duration=timedelta(hours=2, minutes=13),
        parental_guide="parental strongly",
        language="french",
    )

    movie1.genres.set([genres_list[0], genres_list[1]])
    movie2.genres.set([genres_list[0], genres_list[1]])
    return [movie1, movie2]


@pytest.fixture
def movie_f1(genre_action):
    movie = Movie.objects.create(
        title="F1",
        description="F1 desc",
        poster="images.gov",
        director="Joseph Kosinski",
        cast="Brad Pitt, Damson Idris, Javier Bardem",
        release="2025-06-25",
        duration=timedelta(hours=1, minutes=30),
        parental_guide="parental guidance",
        language="italian",
    )
    movie.genres.set([genre_action])
    return movie


@pytest.fixture
def city_london():
    return City.objects.create(name="London")


@pytest.fixture
def city_berlin():
    return City.objects.create(name="Berlin")


@pytest.fixture
def theater_london(city_london):
    return Theater.objects.create(name="Room 1", city=city_london, rows=2, columns=4)


@pytest.fixture
def showtime_f1_london(movie_f1, theater_london):
    return Showtime.objects.create(
        movie=movie_f1,
        theater=theater_london,
        starts_at=timezone.now() + timedelta(days=1, hours=1),
    )


@pytest.fixture
def manager_user():
    return User.objects.create_user(
        username="manager", password="test123", is_staff=False, role="manager"
    )


@pytest.fixture
def planner_user():
    return User.objects.create_user(
        username="planner", password="test123", is_staff=False, role="planner"
    )


@pytest.fixture
def staff_user():
    return User.objects.create_user(username="staff", password="test123", is_staff=True)


@pytest.fixture
def normal_user():
    return User.objects.create_user(username="user", password="test123")
