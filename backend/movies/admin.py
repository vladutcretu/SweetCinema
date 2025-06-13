from django.contrib import admin

# App
from .models import Genre, Movie

# Register your models here.


admin.site.register(Genre)
admin.site.register(Movie)
