# Python
import os

# 3rd party apps
from celery import Celery

# Write settings here


# Set the default Django settings module for the 'celery' program
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

app = Celery("backend")

# Get settings from settings.py
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps
app.autodiscover_tasks()
