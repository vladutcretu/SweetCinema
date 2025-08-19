# Django
from django.core.management.base import BaseCommand

# 3rd party apps
from django_celery_beat.models import PeriodicTask, CrontabSchedule

# Write command here

class Command(BaseCommand):
    help = "Set up newsletter command to run every Sunday at 12:00 PM"

    def handle(self, *args, **options):
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute="0",
            hour="12",
            day_of_week="7",
            month_of_year="*",
            timezone="Europe/Bucharest",
        )

        task, created = PeriodicTask.objects.get_or_create(
            name="Scan for users who want newsletter",
            defaults={
                "crontab": schedule,
                "task": "users.tasks.users_newsletter",
                "enabled": True,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS("Periodic task (newsletter) created successfully!"))
        else:
            self.stdout.write(self.style.WARNING("Periodic task (newsletter) already exists!"))
