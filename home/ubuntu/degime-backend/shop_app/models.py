
from django.db import models

class Product(models.Model):
    product_code = models.CharField(max_length=8, unique=True)
    product_name = models.CharField(max_length=255)
    front_image = models.ImageField(upload_to='product_images/')
    back_image = models.ImageField(upload_to='product_images/')
    logo_color = models.CharField(max_length=20, choices=[('white', 'White'), ('black', 'Black'), ('blue', 'Blue')])
    is_public = models.BooleanField(default=True)
    description = models.TextField()
    stock = models.IntegerField()
    is_new = models.BooleanField(default=False)
    is_recommended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name

