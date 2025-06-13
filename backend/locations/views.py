# DRF
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

# 3rd party apps
from django_filters.rest_framework import DjangoFilterBackend

# App
from .models import City, Theater, Seat
from .serializers import CitySerializer, TheaterSerializer, SeatSerializer

# Create your views here.


class CityListView(ListAPIView):
    """
    View to list all City objects.
    Available to any role; not required token authentication.
    """

    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [AllowAny]


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
