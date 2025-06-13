# DRF
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

# App
from .models import Genre, Movie
from .serializers import GenreSerializer, MovieSerializer

# Create your views here.


class GenreListView(ListAPIView):
    """
    View to list all Genre objects.
    Available to any role; not required token authentication.
    """

    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]


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
