# Django
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# App
from locations.models import City

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name_plural = "UserProfiles"

    def __str__(self):
        return f"{self.user.username} - {self.city}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Create UserProfile instance for every new created User.
    """
    if created:
        UserProfile.objects.create(user=instance)
