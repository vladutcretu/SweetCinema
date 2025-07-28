# Django
from django.contrib.auth.models import Group, User
from django.utils import timezone
from datetime import timedelta

# Pytest
import pytest

# App
from ..models import Showtime
from movies.models import Genre, Movie
from locations.models import City, Theater

# Write your fixtures here.


@pytest.fixture
def genre_action():
    return Genre.objects.create(name="Action")

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
        language="italian"
    )
    movie.genres.set([genre_action])
    return movie

@pytest.fixture
def city_london():
    return City.objects.create(name="London")

@pytest.fixture
def theater_london(city_london):
    return Theater.objects.create(
        name="Room 1",
        city=city_london,
        rows=2,
        columns=4
    )

@pytest.fixture
def showtime_f1_london(movie_f1, theater_london):
    return Showtime.objects.create(
        movie=movie_f1,
        theater=theater_london,
        starts_at=timezone.now() + timedelta(days=1, hours=1),
    )

@pytest.fixture
def showtimes_list(movie_f1, theater_london):
    return Showtime.objects.bulk_create([
        Showtime(
            movie=movie_f1,
            theater=theater_london,
            price=50,
            starts_at=timezone.now() + timedelta(days=2, hours=1),
            format="IMAX",
            presentation="dub"
        ),
        Showtime(
            movie=movie_f1,
            theater=theater_london,
            price=55,
            starts_at=timezone.now() + timedelta(days=3, hours=1),
            format="Dolby",
            presentation="sub"
        )
    ])

@pytest.fixture
def manager_group():
    return Group.objects.create(name="Manager")

@pytest.fixture
def employee_group():
    return Group.objects.create(name="Employee")

@pytest.fixture
def manager_user(manager_group):
    user = User.objects.create_user(username="manager", password="test123", is_staff=False)
    user.groups.add(manager_group)
    return user

@pytest.fixture
def employee_user(employee_group):
    user = User.objects.create_user(username="employee", password="test123", is_staff=False)
    user.groups.add(employee_group)
    return user

@pytest.fixture
def staff_user():
    return User.objects.create_user(username="staff", password="test123", is_staff=True)

@pytest.fixture
def normal_user():
    return User.objects.create_user(username="user", password="test123")
