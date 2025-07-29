# Pytest
import pytest

# App
from ..serializers import (
    # User
    UserSerializer,
    UserUpdateSerializer,
    UserPassworderializer,
)

# Create your tests here.

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# User
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_user_serializer(users_list):
    serializer = UserSerializer(users_list, many=True)
    data = serializer.data

    assert len(data) == 6

    assert "id" in data[0]
    assert "email" in data[0]
    assert "username" in data[1]
    assert "email" in data[1]
    assert "groups" in data[2]
    assert "is_staff" in data[2]
    assert "is_superuser" in data[3]
    assert "password" in data[3]
    assert "city_id" in data[4]


@pytest.mark.django_db
class TestUserUpdateSerializer:
    def test_update_groups(self, normal_user2, manager_group, employee_group):
        data = {"groups": ["Manager", "Employee"]}
        serializer = UserUpdateSerializer(
            instance=normal_user2, data=data, partial=True
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        assert set(normal_user2.groups.values_list("name", flat=True)) == {
            "Manager",
            "Employee",
        }

    def test_update_city_successfully(self, normal_user2, city_london):
        data = {"city": city_london.name}
        serializer = UserUpdateSerializer(
            instance=normal_user2, data=data, partial=True
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        profile = normal_user2.userprofile
        assert profile.city == city_london

    def test_update_city_not_found(self, normal_user2, city_london):
        data = {"city": "City"}
        serializer = UserUpdateSerializer(
            instance=normal_user2, data=data, partial=True
        )
        assert not serializer.is_valid()
        assert "city" in serializer.errors
        assert serializer.errors["city"][0] == "City name 'City' not found!"

    def test_update_other_user_fields(self, normal_user2):
        data = {"username": "NewUsername"}
        serializer = UserUpdateSerializer(
            instance=normal_user2, data=data, partial=True
        )
        assert serializer.is_valid(), serializer.errors
        serializer.save()

        normal_user2.refresh_from_db()
        assert normal_user2.username != "NewUsername"


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
