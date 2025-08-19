# Django
from django.core.management.base import BaseCommand

# 3rd party apps
from django_celery_beat.models import PeriodicTask, CrontabSchedule

# Write command here


class Command(BaseCommand):
    help = "Set up promotion_birthday command to run daily at 12:05 AM"

    def handle(self, *args, **options):
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute="5",
            hour="0",
            day_of_week="*",
            month_of_year="*",
            timezone="Europe/Bucharest",
        )

        task, created = PeriodicTask.objects.get_or_create(
            name="Scan for users who celebrate their birthday on todays date",
            defaults={
                "crontab": schedule,
                "task": "users.tasks.users_promotion_birthday",
                "enabled": True,
            },
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    "Periodic task (users birthday) created successfully!"
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING("Periodic task (users birthday) already exists!")
            )
