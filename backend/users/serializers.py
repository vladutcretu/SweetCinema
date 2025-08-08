# DRF
from rest_framework import serializers

# App
from .models import User, UserRole
from locations.models import City

# Create your serializers here.


class UserSerializer(serializers.ModelSerializer):
    """
    Contains fields: id, email, username, groups, is_staff, is_superuser, password(bool), city_id.
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
        
    
class UserRetrieveSerializer(serializers.ModelSerializer):
    """
    Include fields first_name, city_name, birthday, promotions, newsletter.
    """
    
    city_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "first_name",
            "city_name",
            "birthday",
            "receive_promotions",
            "receive_newsletter",
        ]

    def get_city_name(self, obj):
        try:
            return obj.city.name if obj and obj.city else None
        except AttributeError:
            return None


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Include editable fields role, city_name, birthday, promotions, newsletter.
    """
    role = serializers.CharField(write_only=True)
    city_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "role",
            "city_name",
            "birthday",
            "receive_promotions",
            "receive_newsletter",
        ]

    def validate_city_name(self, value):
        """
        Validate that city exists before update.
        """
        if not City.objects.filter(name=value).exists():
            raise serializers.ValidationError(f"City '{value}' not found.")
        return value
    
    def validate_birthday(self, value):
        """
        Validate that birthday is null before update.
        ** Can add age validation > 12 at some point. **
        """
        user = self.instance
        if user.birthday:
            raise serializers.ValidationError("Birthday is already set.")
        return value

    def update(self, instance, validated_data):
        request = self.context.get("request")
        is_staff = request.user.is_staff or request.user.is_superuser

        # Update role (only staff allowed)
        new_role = validated_data.pop("role", None)
        if new_role: 
            if is_staff:
                if new_role not in UserRole.values:
                    raise serializers.ValidationError(
                        f"{new_role} is invalid. Please select: manager, planner, cashier or standard!"
                    )
                instance.role = new_role
            else:
                raise serializers.ValidationError("You do not have access to update role!")

        # Update city (cashier not allowed)
        city_name = validated_data.pop("city_name", None)
        if city_name:
            if is_staff or instance.role != "cashier":
                city = City.objects.get(name=city_name)
                instance.city = city
            else:
                raise serializers.ValidationError("Cashiers cannot update their city.")

        # Update birthday (if is null)
        birthday = validated_data.get("birthday")
        if birthday and instance.birthday:
            raise serializers.ValidationError("Birthday is already set.")

        # Update remaining fields (promotions, newsletter)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserPassworderializer(serializers.Serializer):
    """
    Contains password field.
    """

    password = serializers.CharField(required=True, write_only=True, min_length=8)
