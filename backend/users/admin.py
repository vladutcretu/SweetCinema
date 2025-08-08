# Django
from django.contrib import admin

# App
from .models import User, UserProfile

# Register your models here.


admin.site.register(User)
admin.site.register(UserProfile)
