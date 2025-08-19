# Django
from django.core.management.base import BaseCommand
from datetime import date

# App
from users.models import User
from users.tasks import send_email_promotion_birthday

# Write command here


class Command(BaseCommand):
    help = "Scan for users who celebrate their birthday on todays date"

    def handle(self, *args, **options):
        todays_date = date.today()
        users_birthday = User.objects.filter(
            receive_promotions=True,
            birthday__day=todays_date.day,
            birthday__month=todays_date.month,
        )

        # Call celery task to send promotional email
        for user in users_birthday:
            context = {
                "user_name": user.first_name,
                "promocode_birthday": f"{user.first_name}_BDAY50",
            }
            send_email_promotion_birthday.delay(user.email, context)

        count = users_birthday.count()
        self.stdout.write(
            f"{count} celebrating their birthday on {todays_date.strftime('%d %B')}!"
        )
