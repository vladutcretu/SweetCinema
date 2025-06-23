# DRF
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

# App
from .models import Booking, Payment
from .serializers import BookingSerializer, PaymentSerializer

# Create your views here.


class BookingListView(ListAPIView):
    """
    View to list all Booking objects.
    Available to any role; not required token authentication.
    """

    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]


class PaymentListView(ListAPIView):
    """
    View to list all Payment objects.
    Available to any role; not required token authentication.
    """

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]
