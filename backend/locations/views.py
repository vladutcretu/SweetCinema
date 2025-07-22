# DRF
from rest_framework import generics, mixins
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
)
from rest_framework.permissions import AllowAny

# 3rd party apps
from drf_spectacular.utils import extend_schema
from django_filters.rest_framework import DjangoFilterBackend

# App
from .models import City, Theater, Seat
from .serializers import (
    # City
    CityPartialSerializer,
    CityCompleteSerializer,
    CityUpdateSerializer,
    # Theater
    TheaterCompleteSerializer,
    TheaterCreateSerializer,
    TheaterUpdateSerializer,
    # Other
    TheaterSerializer,
    SeatSerializer,
)
from users.permissions import IsManager, IsManagerOrEmployee

# Create your views here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# City
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@extend_schema(tags=["v1 - Cities"])
class CityListCreateView(generics.ListCreateAPIView):
    """
    GET: list all City objects, but the response is different for 
    visitor / user and staff / 'Manager' group.\n
    POST: create City object, but only for staff / 'Manager' group.\n
    """

    queryset = City.objects.all()

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsManager()]
        return [AllowAny()]

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and (
            user.is_staff or 
            user.groups.filter(name="Manager").exists()
        ):
            return CityCompleteSerializer
        return CityPartialSerializer
    

@extend_schema(tags=["v1 - Cities"])
class CityUpdateDestroyView(
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    """
    Only available to staff or 'Manager' group.\n
    PATCH: partial update City object (name, address).\n
    DELETE: delete City object.\n
    """

    queryset = City.objects.all()
    serializer_class = CityUpdateSerializer
    permission_classes = [IsManager]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Theater
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@extend_schema(tags=["v1 - Theaters"])
class TheaterListCreateView(generics.ListCreateAPIView):
    """
    Only available to staff or 'Manager' group.\n
    GET: list all Theater objects, with complete fields on response.\n
    POST: create Theater object.\n
    """

    queryset = Theater.objects.select_related("city")
    serializer_class = TheaterCompleteSerializer
    
    def get_permissions(self):
        if self.request.method == "GET":
            return [IsManagerOrEmployee()]
        return [IsManager()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TheaterCreateSerializer
        return TheaterCompleteSerializer


@extend_schema(tags=["v1 - Theaters"])
class TheaterUpdateDestroyView(
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    """
    Only available to staff or 'Manager' group.\n
    PATCH: partial update Theater object (name, rows, columns).\n
    DELETE: delete Theater object.\n
    """

    queryset = Theater.objects.all()
    serializer_class = TheaterUpdateSerializer
    permission_classes = [IsManager]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


# Other
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
