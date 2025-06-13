# DRF
from rest_framework import serializers

# App
from .models import Showtime
from movies.serializers import MovieSerializer
from locations.serializers import TheaterSerializer

# Create your serializers here.


class ShowtimeSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    theater = TheaterSerializer(read_only=True)

    class Meta:
        model = Showtime
        fields = ["movie", "theater", "price", "date", "time"]
