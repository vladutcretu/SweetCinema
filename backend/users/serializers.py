# Django
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

# DRF
from rest_framework import serializers

# App
from .models import UserProfile
from locations.models import City

# Create your serializers here.


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    password = serializers.BooleanField()
    city = serializers.SerializerMethodField()

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
            "city",
        ]

    def get_city(self, obj):
        """
        Get city.id from User.UserProfile.City.
        """
        try:
            if hasattr(obj, 'userprofile') and obj.userprofile.city:
                return obj.userprofile.city.id
            return None
        except AttributeError:
            return None


class UserUpdateSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=Group.objects.all()
    )

    class Meta:
        model = User
        fields = ["groups"]


class UserUpdateCitySerializer(serializers.ModelSerializer):
    city = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ["city"]

    def validate_city(self, value):
        """
        Validate that city exists before update.
        """
        if not value:
            raise serializers.ValidationError("City name cannot be empty.")

        try:
            City.objects.get(name=value)
        except City.DoesNotExist:
            raise serializers.ValidationError(f"City '{value}' not found!")

        return value

    def update(self, instance, validated_data):
        city_name = validated_data.get("city")
        if city_name:
            city = City.objects.get(name=city_name)
            instance.city = city
            instance.save()
        return instance


class UserPasswordCreateSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)


class UserPasswordVerifySerializer(serializers.Serializer):
    password = serializers.CharField(required=True, write_only=True)
