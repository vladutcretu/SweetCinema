# Django
from django.core.management.base import BaseCommand
from django.utils import timezone

# App
from tickets.models import Booking, BookingStatus
from tickets.tasks import send_email_expire_reservation

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

        # Call celery task to send email for bookings.status=reserved > booking.status=expired
        for booking in expired_bookings.filter(status=BookingStatus.RESERVED):
                context = {
                    "user_name": booking.user.first_name,
                    "movie_title": booking.showtime.movie.title,
                    "theater_name": booking.showtime.theater.name,
                    "theater_city": booking.showtime.theater.city.name,
                    "showtime_starts": booking.showtime.starts_at.strftime("%d.%m.%Y %H:%M"),
                    "seats": f"R{booking.seat.row}-C{booking.seat.column}",
                    "price": booking.showtime.price,
                }
                send_email_expire_reservation.delay(booking.user.email, context)

        count = expired_bookings.update(status=BookingStatus.EXPIRED)
        self.stdout.write(f"{count} bookings expired!")
