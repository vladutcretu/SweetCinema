# Django
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

# App
from locations.models import City

# Create your models here.


class UserRole(models.TextChoices):
    MANAGER = "manager", "Manager"
    PLANNER = "planner", "Planner"
    CASHIER = "cashier", "Cashier"
    STANDARD = "standard", "Standard"


class User(AbstractUser):
    role = models.CharField(max_length=55, choices=UserRole.choices, default=UserRole.STANDARD)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    receive_promotions = models.BooleanField(default=False)
    receive_newsletter = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Users"
        ordering = ["-id"]

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name_plural = "UserProfiles"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.user.username}, {self.city}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Create UserProfile instance for every new created User.
    """
    if created:
        UserProfile.objects.create(user=instance)
