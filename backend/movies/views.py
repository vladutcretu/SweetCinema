# Django
from django.utils import timezone

# DRF
from rest_framework import generics, mixins
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

# 3rd party apps
from drf_spectacular.utils import extend_schema

# App
from .models import Genre, Movie
from .serializers import (
    # Genre
    GenrePartialSerializer,
    GenreCompleteSerializer,
    # Movie
    MoviePartialSerializer,
    MovieCompleteSerializer,
    MovieCreateUpdateSerializer,
    MovieRetrieveSerializer,
)
from users.permissions import IsManagerOrEmployee

# Create your views here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Genre
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@extend_schema(tags=["v1 - Genres"])
class GenreListCreateView(generics.ListCreateAPIView):
    """
    Only available to staff or 'Manager', 'Employee' group.\n
    GET: list all Genre objects, with complete fields on response.\n
    POST: create Genre object.\n
    """

    queryset = Genre.objects.all()
    permission_classes = [IsManagerOrEmployee]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return GenreCompleteSerializer
        return GenreCompleteSerializer


@extend_schema(tags=["v1 - Genres"])
class GenreUpdateDestroyView(
    mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView
):
    """
    Only available to staff or 'Manager', 'Employee' group.\n
    PATCH: update name of Genre object.\n
    DELETE: delete Genre object.\n
    """

    queryset = Genre.objects.all()
    serializer_class = GenrePartialSerializer
    permission_classes = [IsManagerOrEmployee]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Movie
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@extend_schema(tags=["v1 - Movies"])
class MovieListView(generics.ListAPIView):
    """
    List Movie objects (a few fields) with future Showtime(s) in a given City.\n
    Required param: city=city_id.\n
    """

    serializer_class = MoviePartialSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        city_id_raw = self.request.query_params.get("city")

        if not city_id_raw:
            raise ValidationError(
                {"detail": "Missing param city on query string."}
            )  # Status: 400

        try:
            city_id = int(city_id_raw)
        except ValueError:
            raise ValidationError(
                {"detail": "Param city must be a valid integer."}
            )  # Status: 400

        return (
            Movie.objects.filter(
                showtime__theater__city_id=city_id,
                showtime__starts_at__gte=timezone.now(),
            )
            .distinct()
            .only("id", "title", "poster")
            .prefetch_related("genres")
        )


@extend_schema(tags=["v1 - Movies"])
class MovieStaffListCreateView(generics.ListCreateAPIView):
    """
    Only available to staff or 'Manager', 'Employee' group.\n
    GET: list all Movie objects (all fields).\n
    POST: create Movie object (all editable fields).\n
    """

    queryset = Movie.objects.prefetch_related("genres")
    permission_classes = [IsManagerOrEmployee]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return MovieCreateUpdateSerializer
        return MovieCompleteSerializer


@extend_schema(tags=["v1 - Movies"])
class MovieRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: retrieve Movie object (id, all editable fields), available to anyone.\n
    PATCH: partial update Movie object, available to staff or 'Manager', 'Employee' group.\n
    DELETE: delete Movie object, available to staff or 'Manager', 'Employee' group.\n
    """

    queryset = Movie.objects.prefetch_related("genres")
    lookup_field = "id"
    http_method_names = ["get", "patch", "delete"]

    def get_permissions(self):
        if self.request.method in ["PATCH", "DELETE"]:
            return [IsManagerOrEmployee()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return MovieRetrieveSerializer
        return MovieCreateUpdateSerializer
