# DRF
from rest_framework import serializers

# App
from .models import Showtime
from movies.models import Movie
from movies.serializers import MoviePartialSerializer
from locations.models import Theater

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Others
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


class TheaterShowtimeSerializer(serializers.ModelSerializer):
    """
    Contains name, columns fields.
    """

    class Meta:
        model = Theater
        fields = ["name", "columns"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Showtime
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


class ShowtimePartialSerializer(serializers.ModelSerializer):
    """
    Contains id, theater_name, price, starts_at, format, presentation fields.
    """

    theater_name = serializers.CharField(source="theater.name")
    format = serializers.CharField(source="get_format_display")
    presentation = serializers.CharField(source="get_presentation_display")

    class Meta:
        model = Showtime
        fields = ["id", "theater_name", "price", "starts_at", "format", "presentation"]


class ShowtimeCashierSerializer(serializers.ModelSerializer):
    """
    Contains id, FK movie as movie_title, FK theater, starts_at, format, presentation fields.
    Foreing Key Theater include [name, columns] fields.
    """

    movie_title = serializers.CharField(source="movie.title")
    theater = TheaterShowtimeSerializer(read_only=True)
    format = serializers.CharField(source="get_format_display")
    presentation = serializers.CharField(source="get_presentation_display")

    class Meta:
        model = Showtime
        fields = ["id", "movie_title", "theater", "starts_at", "format", "presentation"]


class ShowtimeMoviePartialSerializer(serializers.ModelSerializer):
    """
    Contains id, FK movie, FK theater, starts_at, format, presentation fields.
    Foreing Key Movie include [id, title, genres, poster] fields.
    Foreign Key Theater include [name, columns].
    """

    movie = MoviePartialSerializer(read_only=True)
    theater = TheaterShowtimeSerializer(read_only=True)
    format = serializers.CharField(source="get_format_display")
    presentation = serializers.CharField(source="get_presentation_display")

    class Meta:
        model = Showtime
        fields = ["id", "movie", "theater", "starts_at", "format", "presentation"]


class ShowtimeCompleteSerializer(serializers.ModelSerializer):
    """
    Contains all fields. FK Movie as movie_title, FK Theater as theater_name,
    and city_name as FK Theater's City.
    """

    movie_title = serializers.CharField(source="movie.title")
    city_name = serializers.CharField(source="theater.city.name")
    theater_name = serializers.CharField(source="theater.name")
    format = serializers.CharField(source="get_format_display")
    presentation = serializers.CharField(source="get_presentation_display")

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie_title",
            "city_name",
            "theater_name",
            "price",
            "starts_at",
            "format",
            "presentation",
            "created_at",
            "updated_at",
        ]


class ShowtimeCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Contains all editable fields.
    """

    movie = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all())
    theater = serializers.PrimaryKeyRelatedField(
        queryset=Theater.objects.select_related("city")
    )

    class Meta:
        model = Showtime
        fields = ["movie", "theater", "price", "starts_at", "format", "presentation"]


class ShowtimeRetrieveSerializer(serializers.ModelSerializer):
    """
    Contains id, all editable fields. FK Movie as movie_title, FK Theater include [name, columns].
    """

    movie_title = serializers.CharField(source="movie.title")
    theater = TheaterShowtimeSerializer(read_only=True)
    format = serializers.CharField(source="get_format_display")
    presentation = serializers.CharField(source="get_presentation_display")

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie_title",
            "theater",
            "price",
            "starts_at",
            "format",
            "presentation",
        ]


class ShowtimeSeatStatusSerializer(serializers.Serializer):
    """
    Contains seat fields: id, row, column, status.
    """

    id = serializers.IntegerField()
    row = serializers.IntegerField()
    column = serializers.IntegerField()
    status = serializers.ChoiceField(choices=["available", "reserved", "purchased"])


class ShowtimeReportSerializer(serializers.Serializer):
    """
    Contains Showtime fields: id & starts_at, FK Movie, City & Theater as movie title,
    city & theater name and metrics: tickets_sold, total_revenue, occupancy_percentage.
    """

    id = serializers.IntegerField()
    movie_title = serializers.CharField()
    city_name = serializers.CharField()
    theater_name = serializers.CharField()
    starts_at = serializers.DateTimeField()
    tickets_sold = serializers.IntegerField()
    total_revenue = serializers.IntegerField()
    occupancy_percentage = serializers.IntegerField()
