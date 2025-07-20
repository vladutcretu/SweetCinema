"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

# 3rd party apps
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

# Write your urls here.

alpha_paterns = [
    # Locations app
    path("api/locations/", include("locations.urls_alpha")),
    # Movies app
    path("api/movies/", include("movies.urls_alpha")),
    # Showtimes app
    path("api/showtimes/", include("showtimes.urls_alpha")),
    # Tickets app
    path("api/tickets/", include("tickets.urls_alpha")),
    # Users app
    path("api/users/", include("users.urls_alpha")),
]

v1_patterns = [

]

urlpatterns = [
    path("admin/", admin.site.urls),
    # API documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    *alpha_paterns,
    *v1_patterns,
]
