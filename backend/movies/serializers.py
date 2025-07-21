# DRF
from rest_framework import serializers

# App
from .models import Genre, Movie

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Genre
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Movie
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class MoviePartialSerializer(serializers.ModelSerializer):
    """
    Contains id, title, genres, poster fields. Foreign Key Genres include id, name fields.
    """
    genres = GenreSerializer(many=True)
    class Meta:
        model = Movie
        fields = ["id", "title", "genres", "poster"]

class MovieCompleteSerializer(serializers.ModelSerializer):
    """
    Contains all fields. Foreign Key Genres include id, name fields.
    """
    genres = GenreSerializer(many=True)
    parental_guide = serializers.CharField(source="get_parental_guide_display")
    language = serializers.CharField(source="get_language_display")
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
            "language",
            "created_at",
            "updated_at"
        ]

class MovieCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Contains all editable fields. Foreign Key Genres include id field.
    """
    genres = serializers.SlugRelatedField(
        many=True, slug_field="id", queryset=Genre.objects.all()
    )
    class Meta:
        model = Movie
        fields = [
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

class MovieRetrieveSerializer(serializers.ModelSerializer):
    """
    Contains id, all editable fields. Foreign Key Genres include id, name fields.
    """
    genres = GenreSerializer(many=True) 
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
