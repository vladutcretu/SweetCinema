# Django
from django.urls import resolve, reverse

# App
from ..views import (
    # Auth
    AuthGoogle,
    # User
    UserDataView,
    UserListView,
    UserRetrieveUpdateView,
    UserSetPasswordView,
    UserVerifyPasswordView,
)

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# AuthGoogle
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


def test_auth_google_resolves():
    match = resolve("/api/v1/users/auth-google/")
    assert match.func.view_class == AuthGoogle


def test_auth_google_reverse():
    assert reverse("auth-google") == "/api/v1/users/auth-google/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserDataView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


def test_user_data_view_create_resolves():
    match = resolve("/api/v1/users/me/")
    assert match.func.view_class == UserDataView


def test_user_data_view_reverse():
    assert reverse("read-own-user") == "/api/v1/users/me/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserListView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


def test_user_list_resolves():
    match = resolve("/api/v1/users/")
    assert match.func.view_class == UserListView


def test_user_list_reverse():
    assert reverse("read-users") == "/api/v1/users/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserRetrieveUpdateView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


def test_user_retrieve_update_resolves():
    match = resolve("/api/v1/users/1/")
    assert match.func.view_class == UserRetrieveUpdateView


def test_user_retrieve_update_reverse():
    assert reverse("retrieve-update-users", args=[1]) == "/api/v1/users/1/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserSetPasswordView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


def test_user_set_password_resolves():
    match = resolve("/api/v1/users/set-password/")
    assert match.func.view_class == UserSetPasswordView


def test_user_set_password_reverse():
    assert reverse("user-set-password") == "/api/v1/users/set-password/"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# UserVerifyPasswordView
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


def test_user_verify_password_resolves():
    match = resolve("/api/v1/users/verify-password/")
    assert match.func.view_class == UserVerifyPasswordView


def test_user_verify_password_reverse():
    assert reverse("user-verify-password") == "/api/v1/users/verify-password/"
