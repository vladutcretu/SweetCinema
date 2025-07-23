# DRF
from rest_framework import serializers

# App
from .models import City, Theater, Seat

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# City
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class CityPartialSerializer(serializers.ModelSerializer):
    """
    Contains id, name fields.
    """
    class Meta:
        model = City
        fields = ["id", "name"]

class CityCompleteSerializer(serializers.ModelSerializer):
    """
    Contains all fields.
    """
    class Meta:
        model = City
        fields = ["id", "name", "address", "created_at", "updated_at"]

class CityUpdateSerializer(serializers.ModelSerializer):
    """
    Contains all editable fields.
    """
    class Meta:
        model = City
        fields = ["name", "address"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Theater
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class TheaterCompleteSerializer(serializers.ModelSerializer):
    """
    Contains all fields. ForeignKey City is represented by city_name.
    """
    city_name = serializers.CharField(source="city.name")
    class Meta:
        model = Theater
        fields = ["id", "name", "city_name", "rows", "columns", "created_at", "updated_at"]

class TheaterCreateSerializer(serializers.ModelSerializer):
    """
    Contains all editable fields. Must introduce city name.
    """
    city = serializers.SlugRelatedField(
        many=False, slug_field="name", queryset=City.objects.all()
    )
    class Meta:
        model = Theater
        fields = ["name", "city", "rows", "columns"]

class TheaterUpdateSerializer(serializers.ModelSerializer):
    """
    Contains all editable fields, except city.
    """
    class Meta:
        model = Theater
        fields = ["name", "rows", "columns"]

class TheaterShowtimeSerializer(serializers.ModelSerializer):
    """
    Contains name, columns fields.
    """
    class Meta:
        model = Theater
        fields = ["name", "columns"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Seat
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
class SeatBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["row", "column"]


# Other
class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name"]


class TheaterSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)

    class Meta:
        model = Theater
        fields = ["id", "name", "city", "rows", "columns"]


class SeatSerializer(serializers.ModelSerializer):
    theater = TheaterSerializer(read_only=True)

    class Meta:
        model = Seat
        fields = ["id", "theater", "row", "column"]
