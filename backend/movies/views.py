# Django
from django.utils import timezone

# DRF
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

# App
from .models import Genre, Movie
from .serializers import (
    # Movie - USER
    UserMovieListSerializer,
    # Others
    GenreSerializer, MovieSerializer, MovieCreateSerializer)
from users.permissions import IsManagerOrEmployee

# Create your views here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Views for Movie - USER
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

class UserMovieListView(ListAPIView):
    """
    View to list all Movie objects that have future showtime(s) in the selected city
    using query param ?city={city_id}.\n
    Response include only id, title, genres, poster and is sorted DESC by ID.\n
    Available to `USER` without token authentication.\n
    """

    serializer_class = UserMovieListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        city_id = self.request.query_params.get("city")

        if not city_id:
            raise ValidationError(
                {"detail": "City param is needed on query string."}
            ) # Status: 400
        
        return (
            Movie.objects
            .filter(
                showtime__theater__city_id=city_id,
                showtime__starts_at__gte=timezone.now()
            )
            .distinct()
            .only("id", "title", "poster")
            .prefetch_related("genres")
            .order_by("-id")
        ) # Status: 200



# Others
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


class MovieCreateView(CreateAPIView):
    """
    View to create a Movie object.
    Available to `Manager` or `Employee` role; required token authentication.
    """

    queryset = Movie.objects.all()
    serializer_class = MovieCreateSerializer
    permission_classes = [IsManagerOrEmployee]


class MovieUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
    View to update and destroy a single Movie object by his ID.
    Avalaible to `Manager` or `Employee` role; required token authentication.
    """

    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsManagerOrEmployee]
    http_method_names = ["patch", "delete"]
