# Django
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

# DRF
from rest_framework import serializers

# Create your serializers here.


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    password = serializers.BooleanField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "groups",
            "is_staff",
            "is_superuser",
            "password",
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=Group.objects.all()
    )

    class Meta:
        model = User
        fields = ["groups"]


class UserPasswordCreateSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)


class UserPasswordVerifySerializer(serializers.Serializer):
    password = serializers.CharField(required=True, write_only=True)
