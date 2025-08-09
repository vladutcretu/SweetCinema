# DRF
from rest_framework import serializers

# Pytest
import pytest
from unittest.mock import Mock

# App
from ..serializers import (
    # User
    UserPartialSerializer,
    UserCompleteSerializer,
    UserRetrieveSerializer,
    UserUpdateSerializer,
    UserPassworderializer,
)

# Create your tests here.

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_user_partial_serializer(cashier_user):
    serializer = UserPartialSerializer(cashier_user)
    data = serializer.data

    assert len(data) == 8

    assert "id" in data
    assert "email" in data
    assert "username" in data
    assert "role" in data
    assert "is_staff" in data
    assert "is_superuser" in data
    assert "password" in data
    assert "city_id" in data


@pytest.mark.django_db
def test_user_complete_serializer(users_list):
    serializer = UserCompleteSerializer(users_list, many=True)
    data = serializer.data

    assert len(data) == 6

    assert "id" in data[0]
    assert "email" in data[0]
    assert "username" in data[1]
    assert "role" in data[1]
    assert "is_staff" in data[2]
    assert "is_superuser" in data[2]
    assert "password" not in data[3]
    assert "city_id" not in data[3]
    assert "city_name" in data[4]
    assert "birthday" in data[4]
    assert "receive_promotions" in data[5]
    assert "receive_newsletter" in data[5]


@pytest.mark.django_db
def test_user_retrieve_serializer(manager_user):
    serializer = UserRetrieveSerializer(manager_user)
    data = serializer.data

    assert len(data) == 5

    assert "first_name" in data
    assert "city_name" in data
    assert "birthday" in data
    assert "receive_promotions" in data
    assert "receive_newsletter" in data


@pytest.mark.django_db
class TestUserUpdateSerializer:
    def create_mock_request(self, user=None, is_staff=False, is_superuser=False):
        """
        Helper method to create a mock request object.
        """
        mock_request = Mock()
        if user:
            mock_request.user = user
        else:
            mock_user = Mock()
            mock_user.is_staff = is_staff
            mock_user.is_superuser = is_superuser
            mock_request.user = mock_user
        return mock_request

    def test_update_role(self, normal_user2):
        mock_request = self.create_mock_request(is_staff=True)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"role": "manager"},
            partial=True,
            context={"request": mock_request},
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        assert normal_user2.role == "manager"

    def test_update_role_non_staff_should_fail(self, normal_user2):
        mock_request = self.create_mock_request(is_staff=False)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"role": "manager"},
            partial=True,
            context={"request": mock_request},
        )

        with pytest.raises(
            serializers.ValidationError, match="You do not have access to update role!"
        ):
            if serializer.is_valid():
                serializer.save()

    def test_update_city_successfully(self, normal_user2, city_london):
        mock_request = self.create_mock_request(is_staff=True)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"city_name": city_london.name},
            partial=True,
            context={"request": mock_request},
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        normal_user2.refresh_from_db()
        assert normal_user2.city == city_london

    def test_update_city_not_found(self, normal_user2):
        mock_request = self.create_mock_request(is_staff=True)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"city_name": "City"},
            partial=True,
            context={"request": mock_request},
        )
        assert not serializer.is_valid()
        assert "city_name" in serializer.errors
        assert "City 'City' not found" in str(serializer.errors["city_name"][0])

    def test_update_city_cashier_should_fail(self, normal_user2, city_london):
        normal_user2.role = "cashier"
        normal_user2.save()

        mock_request = self.create_mock_request(is_staff=False)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"city_name": city_london.name},
            partial=True,
            context={"request": mock_request},
        )

        with pytest.raises(
            serializers.ValidationError, match="Cashiers cannot update their city"
        ):
            if serializer.is_valid():
                serializer.save()

    def test_update_other_user_fields(self, normal_user2):
        mock_request = self.create_mock_request(is_staff=True)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"username": "NewUsername"},
            partial=True,
            context={"request": mock_request},
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        normal_user2.refresh_from_db()

        assert normal_user2.username != "NewUsername"

    def test_update_birthday_success(self, normal_user2):
        mock_request = self.create_mock_request(is_staff=True)

        from datetime import date

        birthday = date(1990, 1, 1)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"birthday": birthday},
            partial=True,
            context={"request": mock_request},
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        normal_user2.refresh_from_db()
        assert normal_user2.birthday == birthday

    def test_update_birthday_already_set_should_fail(self, normal_user2):
        from datetime import date

        normal_user2.birthday = date(1985, 1, 1)
        normal_user2.save()

        mock_request = self.create_mock_request(is_staff=True)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"birthday": date(1990, 1, 1)},
            partial=True,
            context={"request": mock_request},
        )

        assert not serializer.is_valid()
        assert "birthday" in serializer.errors
        assert "Birthday is already set" in str(serializer.errors["birthday"][0])

    def test_update_newsletter_and_promotions(self, normal_user2):
        mock_request = self.create_mock_request(is_staff=False)

        serializer = UserUpdateSerializer(
            instance=normal_user2,
            data={"receive_newsletter": True, "receive_promotions": True},
            partial=True,
            context={"request": mock_request},
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        normal_user2.refresh_from_db()

        assert normal_user2.receive_newsletter  # True
        assert normal_user2.receive_promotions  # True


class TestUserPasswordSerializer:
    def test_valid_password(self):
        data = {"password": "test1234"}
        serializer = UserPassworderializer(data=data)
        assert serializer.is_valid(), serializer.errors
        assert serializer.validated_data["password"] == "test1234"

    def test_missing_password(self):
        serializer = UserPassworderializer(data={})
        assert not serializer.is_valid()
        assert "password" in serializer.errors

    def test_short_password(self):
        data = {"password": "test"}
        serializer = UserPassworderializer(data=data)
        assert not serializer.is_valid()
        assert "password" in serializer.errors
        assert (
            "Ensure this field has at least 8 characters."
            in serializer.errors["password"][0]
        )
