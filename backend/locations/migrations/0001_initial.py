# Generated by Django 5.2 on 2025-07-20 10:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="City",
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
                ("name", models.CharField(max_length=55, unique=True)),
                ("address", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name_plural": "Cities",
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Theater",
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
                ("name", models.CharField(max_length=55)),
                ("rows", models.PositiveSmallIntegerField()),
                ("columns", models.PositiveSmallIntegerField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "city",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="theaters",
                        to="locations.city",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Theaters",
                "ordering": ["city__name", "name"],
            },
        ),
        migrations.CreateModel(
            name="Seat",
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
                ("row", models.PositiveSmallIntegerField()),
                ("column", models.PositiveSmallIntegerField()),
                (
                    "theater",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="seats",
                        to="locations.theater",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Seats",
                "ordering": ["theater__city__name", "theater__name", "row", "column"],
                "unique_together": {("theater", "row", "column")},
            },
        ),
    ]
