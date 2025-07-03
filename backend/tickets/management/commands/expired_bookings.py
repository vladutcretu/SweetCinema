# Django
from django.core.management.base import BaseCommand
from django.utils import timezone

# App
from tickets.models import Booking, BookingStatus

# Write command here


class Command(BaseCommand):
    help = (
        "Update from `Booking.status=reserved` OR from `Booking.status=pending_payment` "
        "to `Booking.status=expired` for objects that have `expires_at` value past the command execution time"
    )

    def handle(self, *args, **options):
        now = timezone.now
        expired_bookings = Booking.objects.filter(
            status__in=[BookingStatus.RESERVED, BookingStatus.PENDING_PAYMENT],
            expires_at__lt=now(),
        )  # less than now
        count = expired_bookings.update(status=BookingStatus.EXPIRED)
        self.stdout.write(f"{count} bookings expired!")
