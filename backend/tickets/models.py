from django.db import models
from django.contrib.auth import get_user_model

# App
from showtimes.models import Showtime
from locations.models import Seat

# Create your models here.


User = get_user_model()


class BookingStatus(models.TextChoices):
    RESERVED = "reserved", "Reserved"
    CANCELED = "canceled", "Canceled"
    EXPIRED = "expired", "Expired"
    PENDING_PAYMENT = "pending_payment", "Pending Payment"
    FAILED_PAYMENT = "failed_payment", "Failed Payment"
    PURCHASED = "purchased", "Purchased"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=55, choices=BookingStatus.choices, default=BookingStatus.RESERVED
    )
    booked_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Bookings"
        ordering = ["-id"]

    def __str__(self):
        return (
            f"{self.showtime.date} {self.showtime.time}, {self.seat} - "
            f"{self.status}, {self.booked_at.strftime('%d %b %Y %H:%M:%S')}, {self.updated_at.strftime('%d %b %Y %H:%M:%S')}"
        )


class PaymentMethod(models.TextChoices):
    VISA = "visa", "VISA"
    MASTERCARD = "mastercard", "MasterCard"


class PaymentStatus(models.TextChoices):
    DECLINED = "declined", "Declined"
    ACCEPTED = "accepted", "Accepted"


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    bookings = models.ManyToManyField(Booking, related_name="payments")
    amount = models.FloatField()
    method = models.CharField(max_length=55, choices=PaymentMethod.choices)
    status = models.CharField(max_length=55, choices=PaymentStatus.choices)
    paid_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Payments"
        ordering = ["-id"]

    def __str__(self):
        return (
            f"{self.user} - {self.status}, {self.paid_at.strftime('%d %b %Y %H:%M:%S')}"
        )
