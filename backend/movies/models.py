from django.db import models

# Create your models here.


class Genre(models.Model):
    name = models.CharField(max_length=55, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Genres"
        ordering = ["name"]

    def __str__(self):
        return self.name


class MoviePG(models.TextChoices):
    GENERAL = "general", "G - General Audiences"
    PARENTAL_GUIDANCE = "parental guidance", "PG - Parental Guidance Suggested"
    PARENTS_STRONGLY = "parental strongly", "PG-13 - Parents Strongly Cautioned"
    RESTRICTED = "restricted", "R - Restricted"
    ADULTS = "adults", "NC-17 - Adults Only"


class MovieLanguage(models.TextChoices):
    EN = "english", "English"
    FR = "french", "French"
    ES = "spanish", "Spanish"
    GE = "german", "German"
    IT = "italian", "Italian"


class Movie(models.Model):
    title = models.CharField(max_length=55, unique=True)
    description = models.TextField(max_length=255)
    genres = models.ManyToManyField(Genre, related_name="movies")
    poster = models.URLField()
    director = models.CharField(max_length=55)
    cast = models.CharField(max_length=255)
    release = models.DateField()
    duration = models.DurationField()
    parental_guide = models.CharField(
        max_length=55, choices=MoviePG.choices, default=MoviePG.GENERAL
    )
    language = models.CharField(
        max_length=55, choices=MovieLanguage.choices, default=MovieLanguage.EN
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Movies"
        ordering = ["-id"]

    def __str__(self):
        return (
            f"{self.title}, created on: {self.created_at.strftime('%d %b %Y %H:%M:%S')}"
        )
