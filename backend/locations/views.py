# Django
from django.utils.functional import cached_property

# DRF
from rest_framework import generics, mixins
from rest_framework.permissions import AllowAny
from rest_framework.filters import OrderingFilter

# 3rd party apps
from drf_spectacular.utils import extend_schema

# App
from .models import City, Theater
from .serializers import (
    # City
    CityPartialSerializer,
    CityCompleteSerializer,
    CityUpdateSerializer,
    # Theater
    TheaterCompleteSerializer,
    TheaterCreateSerializer,
    TheaterUpdateSerializer,
)
from users.permissions import IsManager, IsManagerOrPlanner
from backend.helpers import StandardPagination

# Create your views here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# City
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@extend_schema(tags=["v1 - Cities"])
class CityListCreateView(generics.ListCreateAPIView):
    """
    GET: list all City objects, but the response is different for
    visitor / user and staff / 'Manager' role.\n
    GET without query param or param staff=false: list with only id & name fields.\n
    GET with param staff=true and staff / 'Manager' role: paginate list with all fields,
    can order filter by id, name, created_at, updated_at.\n
    POST: create City object, but only for staff / 'Manager' role.\n
    Ordering by id, name - default, created_at, updated_at with standard pagination.\n
    """

    queryset = City.objects.all()
    filter_backends = [OrderingFilter]
    ordering_fields = ["id", "name", "created_at", "updated_at"]
    ordering = ["name"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsManager()]
        return [AllowAny()]
    
    @cached_property
    def staff_mode(self):
        """
        Return true if request have query param staff=true and is made by staff / 'Manager' role.
        """
        staff_param = self.request.query_params.get("staff", "").lower() == "true"
        user = self.request.user
        return (
            staff_param
            and user.is_authenticated
            and (user.is_staff or getattr(user, "role", None) == "manager")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CityUpdateSerializer
        if self.staff_mode:
            return CityCompleteSerializer
        return CityPartialSerializer

    def filter_queryset(self, queryset):
        # Apply or ignore ordering param for staff or non-staff request
        if not self.staff_mode:
            return queryset.order_by("name")
        return super().filter_queryset(queryset)
    
    def paginate_queryset(self, queryset):
        # Apply or ignore paginate param for staff or non-staff request
        if self.staff_mode:
            self.pagination_class = StandardPagination
            return super().paginate_queryset(queryset)
        return None


@extend_schema(tags=["v1 - Cities"])
class CityUpdateDestroyView(
    mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView
):
    """
    Only available to staff or 'Manager' role.\n
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
    Only available to staff or 'Manager' role.\n
    GET: list all Theater objects, with complete fields on response;
    available to 'Planner' role.\n
    POST: create Theater object.\n
    Ordering by id, city (name) - default, created_at, updated_at with standard pagination.\n
    """

    queryset = Theater.objects.select_related("city")
    serializer_class = TheaterCompleteSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ["id", "city", "created_at", "updated_at"]
    ordering = ["city"]
    pagination_class = StandardPagination

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsManagerOrPlanner()]
        return [IsManager()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TheaterCreateSerializer
        return TheaterCompleteSerializer


@extend_schema(tags=["v1 - Theaters"])
class TheaterUpdateDestroyView(
    mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView
):
    """
    Only available to staff or 'Manager' role.\n
    PATCH: partial update Theater object (name, rows, columns).\n
    DELETE: delete Theater object.\n
    """

    queryset = Theater.objects.select_related("city")
    serializer_class = TheaterUpdateSerializer
    permission_classes = [IsManager]
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
