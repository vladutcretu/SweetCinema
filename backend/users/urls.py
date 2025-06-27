# Django
from django.urls import path

# 3rd party
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView

# App
from .views import AuthGoogle, UserDataView, UserListView

# Create your urls here.


urlpatterns = [
    path("auth-google/", AuthGoogle.as_view(), name="auth-google"),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("", UserListView.as_view(), name="user-list"),
    path("user/", UserDataView.as_view(), name="user-data"),
]
