# Django
from django.core.management.base import BaseCommand

# 3rd party apps
from django_celery_beat.models import PeriodicTask, CrontabSchedule

# Write command here

class Command(BaseCommand):
    help = "Set up promotion_city command to run daily at 9:00 AM"

    def handle(self, *args, **options):
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute="0",
            hour="9",
            day_of_week="*",
            month_of_year="*",
            timezone="Europe/Bucharest",
        )

        task, created = PeriodicTask.objects.get_or_create(
            name="Scan for users that have set a specific city",
            defaults={
                "crontab": schedule,
                "task": "users.tasks.users_promotion_city",
                "enabled": True,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS("Periodic task (users city) created successfully!"))
        else:
            self.stdout.write(self.style.WARNING("Periodic task (users city) already exists!"))
