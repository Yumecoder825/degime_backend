from django.db import models

class ShippingOrder(models.Model):
    tracking_number = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    is_shipped = models.BooleanField(default=False)

    def __str__(self):
        return f"Shipping Order (ID: {self.pk})"
