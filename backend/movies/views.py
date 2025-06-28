# DRF
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
)
from rest_framework.permissions import AllowAny

# App
from .models import Genre, Movie
from .serializers import GenreSerializer, MovieSerializer
from users.permissions import IsManagerOrEmployee

# Create your views here.


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


class MovieListView(ListAPIView):
    """
    View to list all Movie objects.
    Available to any role; not required token authentication.
    """

    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]


class MovieRetrieveView(RetrieveAPIView):
    """
    View to retrieve a single Movie object by his ID.
    Available to any role; not required token authentication.
    """

    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]
