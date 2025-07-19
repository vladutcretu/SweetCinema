# DRF
from rest_framework import serializers

# App
from .models import Showtime
from movies.serializers import MovieSerializer
from locations.serializers import TheaterSerializer
from locations.models import Theater

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Theater - User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class TheaterInShowtimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = ["name"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Showtime - User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class MovieShowtimeListSerializer(serializers.ModelSerializer):
    theater_name = serializers.CharField(source="theater.name", read_only=True)
    format = serializers.CharField(source="get_format_display", read_only=True)

    class Meta:
        model = Showtime
        fields = ["id", "theater_name", "starts_at", "format"]
    # theater = TheaterInShowtimeSerializer(read_only=True)
    # format = serializers.CharField(
    #     source="get_format_display", 
    #     read_only=True
    # )

    # class Meta:
    #     model = Showtime
    #     fields = ["id", "theater", "starts_at", "format"]


# Other
class ShowtimeSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    theater = TheaterSerializer(read_only=True)

    class Meta:
        model = Showtime
        fields = ["id", "movie", "theater", "price", "starts_at"]


class ShowtimeCreateStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showtime
        fields = ["movie", "theater", "price", "starts_at"]
