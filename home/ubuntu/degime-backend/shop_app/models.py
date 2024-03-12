from django.db import models


class Product(models.Model):
    code = models.CharField(max_length=15, unique=True)  # Add the otp
    title = models.CharField(max_length=255)
    image_urls = models.JSONField(max_length=4095)
    back_image_urls = models.JSONField(max_length=4095)
    price_without_fee = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    stock = models.IntegerField(default=0)
    description = models.CharField(max_length=1023, null=True, blank=True)
    is_public = models.BooleanField(default=False)
    logo_color = models.CharField(max_length=15, default=0)
    is_new = models.BooleanField(default=False)
    is_recommended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
