
from django.db import models

class Sale(models.Model):
    date_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # Add more fields as needed

    def __str__(self):
        return f"Sale (ID: {self.pk})"
