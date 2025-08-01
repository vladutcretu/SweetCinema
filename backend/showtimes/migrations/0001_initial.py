# Generated by Django 5.2 on 2025-07-20 10:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("locations", "0001_initial"),
        ("movies", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Showtime",
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
                    "price",
                    models.DecimalField(decimal_places=2, default=35, max_digits=10),
                ),
                ("starts_at", models.DateTimeField()),
                (
                    "format",
                    models.CharField(
                        choices=[
                            ("2D", "2D"),
                            ("3D", "3D"),
                            ("IMAX", "IMAX"),
                            ("4DX", "4DX"),
                            ("ScreenX", "ScreenX"),
                            ("Dolby", "Dolby Cinema"),
                        ],
                        default="2D",
                        max_length=55,
                    ),
                ),
                (
                    "presentation",
                    models.CharField(
                        choices=[
                            ("native", "Native language"),
                            ("dub", "Dubbing"),
                            ("sub", "Subtitling"),
                        ],
                        default="native",
                        max_length=55,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "movie",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="movies.movie"
                    ),
                ),
                (
                    "theater",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="locations.theater",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Showtimes",
                "ordering": ["movie", "theater__city__name", "starts_at"],
                "unique_together": {("theater", "starts_at")},
            },
        ),
    ]
