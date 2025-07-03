# Django
from django.core.management.base import BaseCommand

# 3rd party apps
from django_celery_beat.models import PeriodicTask, CrontabSchedule

# Write command here


class Command(BaseCommand):
    help = "Set up expired_bookings command to run on every 5 minutes."

    def handle(self, *args, **options):
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute="*/5",
            hour="*",
            day_of_week="*",
            day_of_month="*",
            month_of_year="*",
            timezone="Europe/Bucharest",
        )

        task, created = PeriodicTask.objects.get_or_create(
            name="Cleanup expired bookings",
            defaults={
                "crontab": schedule,
                "task": "tickets.tasks.clean_expired_bookings",
                "enabled": True,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS("Periodic task created successfully!"))
        else:
            self.stdout.write(self.style.WARNING("Periodic task already exists!"))
