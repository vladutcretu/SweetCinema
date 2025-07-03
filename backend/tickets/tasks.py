# Python
import logging

# Django
from django.core.management import call_command

# 3rd party apps
from celery import shared_task

# Write tasks here


logger = logging.getLogger(__name__)


@shared_task
def clean_expired_bookings():
    """
    Perform a scan to check if exists `Booking` instances with `expires_at` date/time value less than current time.
    """

    try:
        logger.info("Starting expired bookings scanning and cleanup task...")
        call_command("expired_bookings")
        logger.info(
            "Expired bookings scanning and cleanup task been completed successfully!"
        )
        return "Task succeeded"
    except Exception:
        logger.error(f"Error running expired bookings task: {str(Exception)}")
        raise
