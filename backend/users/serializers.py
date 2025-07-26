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
    """
    Contains id, email, username, groups, is_staff, is_superuser, password(bool), city_id.
    """
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    password = serializers.BooleanField()
    city_id = serializers.SerializerMethodField()

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
            "city_id",
        ]

    def get_city_id(self, obj):
        """
        Get city.id from User.UserProfile.City.
        """
        try:
            if hasattr(obj, "userprofile") and obj.userprofile.city:
                return obj.userprofile.city.id
            return None
        except AttributeError:
            return None


class UserUpdateSerializer(serializers.Serializer):
    """
    Include user account groups and user profile city (both fields expects names, not ids).
    """
    groups = serializers.SlugRelatedField(
        many=True, 
        slug_field="name", 
        queryset=Group.objects.all(),
        required=False
    )
    city = serializers.CharField(write_only=True, required=False)

    def validate_city(self, value):
        """
        Validate that city exists before update.
        """
        try:
            City.objects.get(name=value)
        except City.DoesNotExist:
            raise serializers.ValidationError(f"City name '{value}' not found!")

        return value

    def update(self, instance, validated_data):
        # Handle groups update (User model)
        groups = validated_data.pop("groups", None)
        if groups is not None:
            instance.groups.set(groups)

        # Handle city update (UserProfile model)
        city_name = validated_data.pop("city", None)
        if city_name:
            try:
                user_profile = instance.userprofile
            except UserProfile.DoesNotExist:
                # Create profile if it doesn't exist
                user_profile = UserProfile.objects.create(user=instance)
            
            city = City.objects.get(name=city_name)
            user_profile.city = city
            user_profile.save()

        # Save any remaining User model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class UserPassworderializer(serializers.Serializer):
    """
    Contains password field.
    """
    password = serializers.CharField(required=True, write_only=True, min_length=8)