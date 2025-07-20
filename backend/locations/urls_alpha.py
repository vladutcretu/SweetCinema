from django.urls import path

# App
from .views import (
    SeatListView,
)
# Create your urls here.


urlpatterns = [
    path("seats/", SeatListView.as_view(), name="seat-list"),
]
