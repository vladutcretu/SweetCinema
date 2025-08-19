# Django
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.core.management import call_command
from django.conf import settings

# 3rd party apps
from celery import shared_task

# Write tasks here


@shared_task(name="email-reset-password")
def send_email_reset_password(user_email, context):
    subject = "Reset your account password"
    html_message = render_to_string("emails/reset_password.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task(name="email-promotion-birthday")
def send_email_promotion_birthday(user_email, context):
    subject = "Happy birthday"
    html_message = render_to_string("emails/promotion_birthday.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task
def users_promotion_birthday():
    # Run the Django command that handles users and sending emails
    call_command("promotion_birthday")


@shared_task(name="email-promotion-city")
def send_email_promotion_city(user_email, context):
    subject = f"Promocode for SweetCinema {context['city_name']}"
    html_message = render_to_string("emails/promotion_city.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task
def users_promotion_city():
    # Run the Django command that handles users and sending emails
    call_command("promotion_city")


@shared_task(name="email-promotion-movie")
def send_email_promotion_movie(user_email, context):
    subject = f"Promocode for movie {context['movie_title']}"
    html_message = render_to_string("emails/promotion_movie.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task
def users_promotion_movie():
    # Run the Django command that handles users and sending emails
    call_command("promotion_movie")


@shared_task(name="email-newsletter")
def send_email_newsletter(user_email, context):
    subject = "Newsletter has arrived"
    html_message = render_to_string("emails/newsletter.html", context)
    send_mail(
        subject=subject,
        message="This is an HTML email. Please view it in a client that supports HTML!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
    )


@shared_task
def users_newsletter():
    # Run the Django command that handles users and sending emails
    call_command("newsletter")
