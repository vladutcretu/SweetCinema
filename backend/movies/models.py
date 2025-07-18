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


class Movie(models.Model):
    title = models.CharField(max_length=55, unique=True)
    description = models.TextField(max_length=255)
    genres = models.ManyToManyField(Genre, related_name="movies")
    poster = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Movies"
        ordering = ["-id"]

    def __str__(self):
        return f'"{self.title}" - created on: {self.created_at.strftime("%d %b %Y %H:%M:%S")}'
