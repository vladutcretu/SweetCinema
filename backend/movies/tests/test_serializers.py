# Pytest
import pytest

# App
from movies.serializers import (
    # Genre - User
    UserGenreSerializer,
    # Movie - User
    UserMovieListSerializer,
    UserMovieRetrieveSerializer,
)

# Create your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Genre - User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_user_genre_serializer(genres_list):
    serializer = UserGenreSerializer(genres_list, many=True)
    genre_names = [genre["name"] for genre in serializer.data]

    assert "Action" in genre_names
    assert "Drama" in genre_names
    assert "Thriller" in genre_names


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie - User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_user_movie_list_serializer(movie_superman):
    serializer = UserMovieListSerializer(movie_superman)
    data = serializer.data

    assert data["title"] == "Superman"
    assert data["poster"] == "https://images.google.com"
    assert data["genres"][0]["name"] == "Action"

@pytest.mark.django_db
def test_user_movie_retrieve_serializer(movie_superman):
    serializer = UserMovieRetrieveSerializer(movie_superman)
    data = serializer.data

    assert data["title"] == "Superman"
    assert data["description"] == (
            "Superman must reconcile his alien Kryptonian heritage with his human "
            "upbringing as reporter Clark Kent. As the embodiment of truth, "
            "justice and the human way he soon finds himself in a world that views "
            "these as old-fashioned."
        )
    assert data["poster"] == "https://images.google.com"
    assert data["director"] == "James Gunn"
    assert data["cast"] == "David Corenswet, Rachel Brosnahan, Nicholas Hoult"
    assert data["release"] == "2025-07-11"
    assert data["duration"] == "02:09:00"
    assert data["parental_guide"] == "R: Restricted"
    assert data["language"] == "English"
