from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

# App
from movies.models import Movie
from locations.models import Theater

# Create your models here.


class Showtime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    price = models.FloatField(default=35)
    date = models.DateField()
    time = models.TimeField()

    class Meta:
        verbose_name_plural = "Showtimes"
        ordering = ["movie", "theater__city__name", "date", "time"]

    def clean(self):
        """
        Method to define validations on creating objects.
        """
        if self.price < 0:
            raise ValidationError({"price": "Price cannot be negative."})

        today = timezone.localdate()
        if self.date < today:
            raise ValidationError({"date": "Date cannot be in the past."})

    def save(self, *args, **kwargs):
        """
        Method to force the validations on every object save.
        """
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.movie.title}, {self.theater.city.name}, {self.theater.name}, {self.date} {self.time}"
