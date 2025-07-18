# Pytest
import pytest

# App
from movies.serializers import (
    # Genre - User
    UserGenreSerializer,
    # Movie - User
    UserMovieListSerializer,
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
def test_user_movie_list_serializer(movie_titanic):
    serializer = UserMovieListSerializer(movie_titanic)
    data = serializer.data

    assert data["title"] == "Titanic"
    assert data["poster"] == "https://images.google.com"
    assert data["genres"][0]["name"] == "Action"
