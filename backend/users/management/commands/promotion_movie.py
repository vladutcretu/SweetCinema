# Django
from django.core.management.base import BaseCommand
from django.utils import timezone

# App
from locations.models import City
from showtimes.models import Showtime
from users.models import User
from users.tasks import send_email_promotion_movie

# Write command here


class Command(BaseCommand):
    help = "Scan for users that have a specific movie in their set city"

    def handle(self, *args, **options):
        # Randomize a showtime scheduled in the future to extract a specific movie
        showtime = (
            Showtime.objects
            .filter(starts_at__gte=timezone.now())
            .select_related("movie", "theater", "theater__city")
            .order_by("?")
            .first()
        )
        if not showtime:
            self.stdout.write(self.style.WARNING("No showtimes found in DB!"))
            return

        movie = showtime.movie

        # Get all cities that have a showtime for the specific movie
        cities_with_movie_showtime = (
            City.objects.filter(theaters__showtime__movie=movie)
            .distinct()
        )

        # Get all users that have a showtime for the specific movie in their city
        users_movie = (
            User.objects
            .filter(receive_promotions=True, city__in=cities_with_movie_showtime)
            .select_related("city")
        )

        # Call celery task to send promotional email
        for user in users_movie:
            context = {
                "user_name": user.first_name,
                "movie_title": movie.title,
                "promocode_movie": f"{movie.title}_MOVIE30",
            }
            send_email_promotion_movie.delay(user.email, context)

        count = users_movie.count()
        self.stdout.write(f"{count} users have movie '{movie.title}' in their set city.")
