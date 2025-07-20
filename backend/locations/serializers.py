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


class TheaterCreateSerializer(serializers.ModelSerializer):
    city = serializers.SlugRelatedField(
        many=False, slug_field="name", queryset=City.objects.all()
    )

    class Meta:
        model = Theater
        fields = ["name", "city", "rows", "columns"]


class SeatSerializer(serializers.ModelSerializer):
    theater = TheaterSerializer(read_only=True)

    class Meta:
        model = Seat
        fields = ["id", "theater", "row", "column"]
