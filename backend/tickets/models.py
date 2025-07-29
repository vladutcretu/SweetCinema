# Django
from django.db import models
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.utils import timezone

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
    expires_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Bookings"
        ordering = ["-id"]

    def save(self, *args, **kwargs):
        """
        Method fills the expires_at field for the instances created with 
        status=reserved or status=pending_payment.
        """
        print(f"[DEBUG] status={self.status}, expires_at={self.expires_at}, starts_at={self.showtime.starts_at if self.showtime else None}")
        if (
            not self.expires_at
            and self.showtime
            and self.status == BookingStatus.RESERVED.value
        ):
            print("Setting expires_at for RESERVED")
            self.expires_at = self.showtime.starts_at - timedelta(minutes=30)
        elif (
            not self.expires_at
            and self.showtime
            and self.status == BookingStatus.PENDING_PAYMENT.value
        ):
            print("Setting expires_at for PENDING_PAYMENT")
            self.expires_at = timezone.now() + timedelta(minutes=1)

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.seat}, "
            f"{self.showtime.starts_at.strftime('%d %b %Y %H:%M:%S')}, "
            f"{self.status}, "
            f"booked on: {self.booked_at.strftime('%d %b %Y %H:%M:%S')}"
        )


class PaymentMethod(models.TextChoices):
    VISA = "visa", "VISA"
    MASTERCARD = "mastercard", "MasterCard"


class PaymentStatus(models.TextChoices):
    DECLINED = "declined", "Declined"
    ACCEPTED = "accepted", "Accepted"


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bookings = models.ManyToManyField(Booking, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=55, choices=PaymentMethod.choices)
    status = models.CharField(max_length=55, choices=PaymentStatus.choices)
    paid_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Payments"
        ordering = ["-id"]

    def __str__(self):
        return (
            f"{self.user}, {self.status}, {self.paid_at.strftime('%d %b %Y %H:%M:%S')}"
        )
