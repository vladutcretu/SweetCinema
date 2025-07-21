# Django
from django.utils import timezone

# DRF
from rest_framework import generics
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

# 3rd party apps
from drf_spectacular.utils import extend_schema

# App
from .models import Genre, Movie
from .serializers import (
    # Movie
    MoviePartialSerializer,
    MovieCompleteSerializer,
    MovieCreateUpdateSerializer,
    MovieRetrieveSerializer,
    # Other
    GenreSerializer
)
from users.permissions import IsManagerOrEmployee

# Create your views here.


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
            raise ValidationError({"detail": "Missing param city on query string."}) # Status: 400
        
        try:
            city_id = int(city_id_raw)
        except ValueError:
            raise ValidationError({"detail": "Param city must be a valid integer."}) # Status: 400

        return (
            Movie.objects
            .filter(
                showtime__theater__city_id=city_id,
                showtime__starts_at__gte=timezone.now()
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
    PATCH: update Movie object, available to staff or 'Manager', 'Employee' group.\n
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
    

# Other
class GenreListView(ListAPIView):
    """
    View to list all Genre objects.
    Available to any role; not required token authentication.
    """

    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]

class GenreCreateView(CreateAPIView):
    """
    View to create a Genre object.
    Available to `Manager` or `Employee` role; required token authentication.
    """

    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsManagerOrEmployee]

class GenreUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
    View to update and destroy a single Genre object by his ID.
    Avalaible to `Manager` or `Employee` role; required token authentication.
    """

    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsManagerOrEmployee]
    http_method_names = ["put", "delete"]

