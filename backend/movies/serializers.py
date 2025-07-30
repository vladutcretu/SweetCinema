# DRF
from rest_framework import serializers

# App
from .models import Genre, Movie

# Create your serializers here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Genre
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


class GenrePartialSerializer(serializers.ModelSerializer):
    """
    Contains id, name fields.
    """

    class Meta:
        model = Genre
        fields = ["id", "name"]


class GenreCompleteSerializer(serializers.ModelSerializer):
    """
    Contains all fields.
    """

    class Meta:
        model = Genre
        fields = ["id", "name", "created_at", "updated_at"]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Movie
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


class MoviePartialSerializer(serializers.ModelSerializer):
    """
    Contains id, title, FK genres, poster fields. ForeignKey include id, name fields.
    """

    genres = GenrePartialSerializer(many=True)

    class Meta:
        model = Movie
        fields = ["id", "title", "genres", "poster"]


class MovieCompleteSerializer(serializers.ModelSerializer):
    """
    Contains all fields. FK Genre include id, name fields.
    """

    genres = GenrePartialSerializer(many=True)
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
            "updated_at",
        ]


class MovieCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Contains all editable fields. FK Genre asks to introduce genre ids.
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
            "language",
        ]


class MovieRetrieveSerializer(serializers.ModelSerializer):
    """
    Contains id, all editable fields. FK Genre include id, name fields.
    """

    genres = GenrePartialSerializer(many=True)
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
        ]
