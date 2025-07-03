# Django
from django.core.management.base import BaseCommand
from django.utils import timezone

# App
from tickets.models import Booking, BookingStatus

# Write command here


class Command(BaseCommand):
    help = (
        "Update from `Booking.status=reserved` to `Booking.status=expired`"
        " for objects that have `expires_at` value past the command execution time"
    )

    def handle(self, *args, **options):
        now = timezone.now
        expired_bookings = Booking.objects.filter(
            status=BookingStatus.RESERVED, expires_at__lt=now()
        )  # less than now
        count = expired_bookings.update(status=BookingStatus.EXPIRED)
        self.stdout.write(f"{count} bookings expired!")
