# DRF
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

# 3rd party apps
from django_filters.rest_framework import DjangoFilterBackend

# App
from .models import Showtime
from .serializers import ShowtimeSerializer

# Create your views here.


class ShowtimeListView(ListAPIView):
    """
    View to list all Showtime objects, with optional filtering by Movie ID and Showtime ID.
    Available to any role; not required token authentication.
    """

    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["movie", "theater"]


class ShowtimeRetrieveView(RetrieveAPIView):
    """
    View to retrieve a single Showtime object by his ID.
    Available to any role; not required token authentication.
    """

    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]
