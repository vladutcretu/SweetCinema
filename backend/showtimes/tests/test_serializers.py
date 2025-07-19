# Pytest
import pytest

# App
from showtimes.serializers import (
    MovieShowtimeListSerializer
)

# Create your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# MovieShowtimeListSerializer
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_movie_showtime_list_serializer(showtime_superman_london):
    serializer = MovieShowtimeListSerializer(showtime_superman_london)
    data = serializer.data

    assert data["id"] == showtime_superman_london.id
    assert data["theater_name"] == showtime_superman_london.theater.name
    assert data["format"] == showtime_superman_london.format
