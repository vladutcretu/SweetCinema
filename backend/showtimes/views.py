# Django
from django.utils import timezone
from django.db.models import Q

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
    View to list all Showtime objects requested by Movie ID AND City ID that
    have `date` value greather than current date (timezone date now) or
    `date` equal to current date (timezone date now) and `time` greater than
    current time (timezone time now).
    Available to any role; not required token authentication.
    """

    queryset = Showtime.objects.filter(date__gte=timezone.now().date()).filter(
        Q(date__gt=timezone.now().date()) | Q(time__gte=timezone.now().time())
    )
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["movie", "theater__city"]


class ShowtimeRetrieveView(RetrieveAPIView):
    """
    View to retrieve a single Showtime object by his ID.
    Available to any role; not required token authentication.
    """

    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [AllowAny]
