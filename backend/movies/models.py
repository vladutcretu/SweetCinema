from django.db import models

# Create your models here.


class Genre(models.Model):
    name = models.CharField(max_length=55, unique=True)

    class Meta:
        verbose_name_plural = "Genres"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=55)
    description = models.TextField(max_length=255)
    genres = models.ManyToManyField(Genre, related_name="movies")
    poster = models.URLField()

    class Meta:
        verbose_name_plural = "Movies"

    def __str__(self):
        return self.title
