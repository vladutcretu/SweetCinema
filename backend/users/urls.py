# Django
from django.urls import path

# App
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView
from .views import (
    # Auth
    AuthGoogle,
    # User
    UserDataView,
    UserListView,
    UserRetrieveUpdateView,
    UserSetPasswordView,
    UserVerifyPasswordView,
    UserResetPasswordView,
)

# Create your urls here.


urlpatterns = [
    # Auth
    path("auth-google/", AuthGoogle.as_view(), name="auth-google"),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    # User
    path("me/", UserDataView.as_view(), name="read-own-user"),
    path("", UserListView.as_view(), name="read-users"),
    path("<int:id>/", UserRetrieveUpdateView.as_view(), name="retrieve-update-users"),
    path("set-password/", UserSetPasswordView.as_view(), name="user-set-password"),
    path(
        "verify-password/",
        UserVerifyPasswordView.as_view(),
        name="user-verify-password",
    ),
    path(
        "reset-password/", UserResetPasswordView.as_view(), name="user-reset-password"
    ),
]
