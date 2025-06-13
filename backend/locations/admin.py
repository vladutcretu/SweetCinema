from django.contrib import admin

# App
from .models import City, Theater, Seat

# Register your models here.


admin.site.register(City)
admin.site.register(Theater)
admin.site.register(Seat)
