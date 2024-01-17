from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    vcode = models.CharField(max_length=6, null=True, blank=True)  # Add the otp
    email_verified = models.BooleanField(default=False)
    # email_verification_token = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username