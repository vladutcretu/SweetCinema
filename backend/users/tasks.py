# Django
from django.template.loader import render_to_string
from django.core.mail import send_mail
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
