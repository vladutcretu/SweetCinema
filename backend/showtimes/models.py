from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

# App
from movies.models import Movie
from locations.models import Theater

# Create your models here.


class ShowtimeFormat(models.TextChoices):
    TwoD = "2D", "2D"
    ThreeD = "3D", "3D"
    IMAX = "IMAX", "IMAX"
    FourDX = "4DX", "4DX"
    SCREENX = "ScreenX", "ScreenX"
    DOLBY = "Dolby", "Dolby Cinema"


class ShowtimePresentation(models.TextChoices):
    NATIVE = "native", "Native language"
    DUB = "dub", "Dubbing"
    SUB = "sub", "Subtitling"


class Showtime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=35)
    starts_at = models.DateTimeField()
    format = models.CharField(
        max_length=55, choices=ShowtimeFormat.choices, default=ShowtimeFormat.TwoD
    )
    presentation = models.CharField(
        max_length=55,
        choices=ShowtimePresentation.choices,
        default=ShowtimePresentation.NATIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Showtimes"
        ordering = ["movie", "theater__city__name", "starts_at"]
        unique_together = ("theater", "starts_at")

    def clean(self):
        """
        Method to define validations on creating objects.
        """
        if self.price < 0:
            raise ValidationError({"price": "Price cannot be negative."})

        if self.starts_at < timezone.now():
            raise ValidationError({"starts_at": "Start time cannot be in the past."})

    def save(self, *args, **kwargs):
        """
        Method to force the validations on every object save.
        """
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.movie.title}, {self.theater.city.name}, {self.theater.name}, {self.starts_at.strftime('%d %b %Y %H:%M:%S')}"
