# Python
from datetime import timedelta
from collections import defaultdict

# Django
from django.core.management.base import BaseCommand
from django.utils import timezone

# App
from locations.models import City
from users.models import User
from users.tasks import send_email_newsletter

# Write command here


class Command(BaseCommand):
    help = "Scan for users who want newsletter"

    def handle(self, *args, **options):
        # Get all cities that have a showtime next week
        cities = City.objects.prefetch_related("theaters__showtime_set__movie")

        city_showtimes = defaultdict(list) # dict {city_id: list(showtimes_next_week)}
        for city in cities:
            for theater in city.theaters.all():
                for showtime in theater.showtime_set.all():
                    if timezone.now() <= showtime.starts_at <= timezone.now() + timedelta(days=300): # update days to 7 
                        city_showtimes[city.id].append(showtime)


        users_subscribed = User.objects.filter(receive_promotions=True).select_related("city")

        # Call celery task to send promotional email
        for user in users_subscribed:
            showtimes = city_showtimes.get(user.city_id, [])
            if not showtimes:
                continue

            serialized_showtimes = [
                {
                    "movie_title": s.movie.title,
                    "theater_name": s.theater.name,
                    "starts_at": s.starts_at.strftime("%d.%m.%Y %H:%M"),
                }
                for s in showtimes
            ]

            context = {
                "user_name": user.first_name,
                "city_name": user.city.name,
                "showtimes": serialized_showtimes,
            }
            send_email_newsletter.delay(user.email, context)

        count = users_subscribed.count()
        self.stdout.write(f"{count} users are subscribed to Newsletter.")
