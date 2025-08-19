# Django
from django.core.management.base import BaseCommand

# App
from locations.models import City
from users.models import User
from users.tasks import send_email_promotion_city

# Write command here


class Command(BaseCommand):
    help = "Scan for users that have set a specific city"

    def handle(self, *args, **options):
        city = City.objects.order_by("?").first() # randomize a city
        if not city:
            self.stdout.write(self.style.WARNING("No cities found in DB!"))
            return
        
        users_city = User.objects.filter(receive_promotions=True, city=city).select_related("city")

        # Call celery task to send promotional email
        for user in users_city:
            context = {
                "user_name": user.first_name, 
                "city_name": user.city.name, 
                "promocode_city": f"{user.city.name}_CITY30",
            }
            send_email_promotion_city.delay(user.email, context)
        
        count = users_city.count()
        self.stdout.write(f"{count} users have city '{city.name}' set!")
