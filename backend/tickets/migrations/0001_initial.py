# Generated by Django 5.2 on 2025-06-23 16:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("locations", "0001_initial"),
        ("showtimes", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Booking",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("reserved", "Reserved"),
                            ("pending_payment", "Pending Payment"),
                            ("purchased", "Purchased"),
                        ],
                        default="reserved",
                        max_length=55,
                    ),
                ),
                ("booked_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "seat",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="locations.seat"
                    ),
                ),
                (
                    "showtime",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="showtimes.showtime",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Bookings",
                "ordering": ["id"],
                "unique_together": {("showtime", "seat")},
            },
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("amount", models.FloatField()),
                (
                    "method",
                    models.CharField(
                        choices=[("visa", "VISA"), ("mastercard", "MasterCard")],
                        max_length=55,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("declined", "Declined"), ("accepted", "Accepted")],
                        max_length=55,
                    ),
                ),
                ("paid_at", models.DateTimeField(auto_now_add=True)),
                (
                    "booking",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="tickets.booking",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Payments",
                "ordering": ["id"],
            },
        ),
    ]
