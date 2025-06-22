# Django
from django.urls import path

# App
from .views import AuthGoogle

# Create your urls here.


urlpatterns = [
    path("auth-google/", AuthGoogle.as_view(), name="auth-google"),
]
