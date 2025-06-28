# DRF
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

# 3rd party apps
from django_filters.rest_framework import DjangoFilterBackend

# App
from .models import City, Theater, Seat
from .serializers import CitySerializer, TheaterSerializer, TheaterCreateSerializer, SeatSerializer
from users.permissions import IsManager

# Create your views here.


class CityListView(ListAPIView):
    """
    View to list all City objects.
    Available to any role; not required token authentication.
    """

    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [AllowAny]


class CityCreateView(CreateAPIView):
    """
    View to create a City object.
    Avalaible to `Manager` role; required token authentication.
    """

    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsManager]


class CityUpdateDestroy(RetrieveUpdateDestroyAPIView):
    """
    View to update and destroy a single City object by his ID.
    Avalaible to `Manager` role; required token authentication.
    """

    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsManager]
    http_method_names = ["put", "delete"]


class TheaterListView(ListAPIView):
    """
    View to list all Theater objects, with optional filtering by City ID.
    Available to any role; not required token authentication.
    """

    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["city"]


class TheaterRetrieveView(RetrieveAPIView):
    """
    View to retrieve a single Theater object by his ID.
    Available to any role; not required token authentication.
    """

    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer
    permission_classes = [AllowAny]


class TheaterCreateView(CreateAPIView):
    """
    View to create a Theater object.
    Avalaible to `Manager` role; required token authentication.
    """

    queryset = Theater.objects.all()
    serializer_class = TheaterCreateSerializer
    permission_classes = [IsManager]


class TheaterUpdateDestroy(RetrieveUpdateDestroyAPIView):
    """
    View to update and destroy a single Theater object by his ID.
    Avalaible to `Manager` role; required token authentication.
    """

    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer
    permission_classes = [IsManager]
    http_method_names = ["patch", "delete"]


class SeatListView(ListAPIView):
    """
    View to list all Seat objects, with optional filtering by Theater ID.
    Available to any role; not required token authentication.
    """

    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["theater"]
