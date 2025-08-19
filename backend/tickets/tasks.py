# Python
import logging

# Django
from django.core.management import call_command
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings

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


@shared_task(name="email-confirm-reservation")
def send_email_confirm_reservation(user_email, context):
    subject = f"Your reservation for {context['movie_title']} ({context['showtime_starts']}) is confirmed"
    html_message = render_to_string("emails/confirm_reservation.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task(name="email-confirm-purchase")
def send_email_confirm_purchase(user_email, context):
    subject = f"Your purchase for {context['movie_title']} ({context['showtime_starts']}) is confirmed"
    html_message = render_to_string("emails/confirm_purchase.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task(name="email-cancel-reservation")
def send_email_cancel_reservation(user_email, context):
    subject = f"Your reservation for {context['movie_title']} ({context['showtime_starts']}) is canceled"
    html_message = render_to_string("emails/cancel_reservation.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task(name="email-expire-reservation")
def send_email_expire_reservation(user_email, context):
    subject = f"Your reservation for {context['movie_title']} ({context['showtime_starts']}) is expired"
    html_message = render_to_string("emails/expire_reservation.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task(name="email-complete-reservation")
def send_email_complete_reservation(user_email, context):
    subject = f"Your reservation for {context['movie_title']} ({context['showtime_starts']}) is completed"
    html_message = render_to_string("emails/complete_reservation.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )
