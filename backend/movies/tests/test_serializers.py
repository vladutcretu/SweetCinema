# Pytest
import pytest

# App
from ..serializers import (
    # Genre
    GenrePartialSerializer,
    GenreCompleteSerializer,
    # Movie
    MoviePartialSerializer,
    MovieCompleteSerializer,
    MovieCreateUpdateSerializer,
    MovieRetrieveSerializer,
)

# Create your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Genre
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_genre_partial_serializer(genres_list):
    serializer = GenrePartialSerializer(genres_list, many=True)
    data = serializer.data

    assert "id" in data[0]
    assert data[0]["name"] == "Thriller"
    assert "created_at" not in data[0]
    assert "id" in data[1]
    assert data[1]["name"] == "Comedy"
    assert "updated_at" not in data[1]
    assert "id" in data[2]
    assert data[2]["name"] == "Drama"


@pytest.mark.django_db
def test_genre_complete_serializer(genres_list):
    serializer = GenreCompleteSerializer(genres_list, many=True)
    data = serializer.data

    assert "id" in data[0]
    assert data[0]["name"] == "Thriller"
    assert "created_at" in data[0]
    assert "id" in data[1]
    assert data[1]["name"] == "Comedy"
    assert "updated_at" in data[1]
    assert "id" in data[2]
    assert data[2]["name"] == "Drama"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Movie
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_movie_partial_serializer(movies_list):
    serializer = MoviePartialSerializer(movies_list, many=True)
    data = serializer.data

    assert len(data) == 2

    assert "id" in data[0]
    assert data[0]["title"] == "Superman"
    assert "genres" in data[0]
    assert data[0]["poster"] == "images.com"
    assert "id" in data[1]
    assert data[1]["title"] == "Jurassic"
    assert "genres" in data[1]
    assert data[1]["poster"] == "images.net"


@pytest.mark.django_db
def test_movie_complete_serializer(movies_list):
    serializer = MovieCompleteSerializer(movies_list, many=True)
    data = serializer.data

    assert len(data) == 2

    assert "id" in data[0]
    assert data[0]["title"] == "Superman"
    assert data[0]["description"] == "Superman desc"
    assert "genres" in data[0]
    assert data[0]["poster"] == "images.com"
    assert "director" in data[0]
    assert "created_at" in data[0]

    assert "cast" in data[1]
    assert data[1]["release"] == "2025-07-02"
    assert data[1]["duration"] == "02:13:00"
    assert data[1]["parental_guide"] == "PG-13 - Parents Strongly Cautioned"
    assert data[1]["language"] == "French"
    assert "updated_at" in data[1]


@pytest.mark.django_db
def test_movie_create_update_serializer(movie_f1):
    serializer = MovieCreateUpdateSerializer(movie_f1)
    data = serializer.data

    assert len(data) == 10

    assert "id" not in data
    assert data["title"] == "F1"
    assert data["description"] == "F1 desc"
    assert "genres" in data
    assert data["poster"] == "images.gov"
    assert "director" in data
    assert "cast" in data
    assert "release" in data
    assert "duration" in data
    assert "parental_guide" in data
    assert "language" in data
    assert "created_at" not in data
    assert "updated" not in data


@pytest.mark.django_db
def test_movie_retrieve_serializer(movie_f1):
    serializer = MovieRetrieveSerializer(movie_f1)
    data = serializer.data

    assert len(data) == 11

    assert "id" in data
    assert data["title"] == "F1"
    assert data["description"] == "F1 desc"
    assert "genres" in data
    assert data["poster"] == "images.gov"
    assert "director" in data
    assert "cast" in data
    assert "release" in data
    assert "duration" in data
    assert "parental_guide" in data
    assert "language" in data
    assert "created_at" not in data
    assert "updated" not in data
