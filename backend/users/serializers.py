# Django
from django.contrib.auth import get_user_model

# DRF
from rest_framework import serializers

# Create your serializers here.


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username"]
