# DRF
from rest_framework import serializers

# App
from .models import Genre, Movie

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Serializers for Genre - USER
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
class UserGenreListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Serializers for Movie - USER
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
class UserMovieListSerializer(serializers.ModelSerializer):
    genres = UserGenreListSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = ["id", "title", "genres", "poster"]


# Others
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
