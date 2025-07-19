# DRF
from rest_framework import serializers

# App
from .models import Genre, Movie

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Genre - User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class UserGenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie - User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class UserMovieListSerializer(serializers.ModelSerializer):
    genres = UserGenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = ["id", "title", "genres", "poster"]


class UserMovieRetrieveSerializer(serializers.ModelSerializer):
    genres = UserGenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            "id", 
            "title", 
            "description", 
            "genres", 
            "poster", 
            "director",
            "cast",
            "release",
            "duration",
            "parental_guide",
            "language"
        ]


# Other
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = ["id", "title", "description", "genres", "poster"]


class MovieCreateSerializer(serializers.ModelSerializer):
    genres = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=Genre.objects.all()
    )

    class Meta:
        model = Movie
        fields = ["id", "title", "description", "genres"]
