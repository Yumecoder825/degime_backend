from django.db import models

class ProjectSettings(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return f"Settings for Project (ID: {self.pk})"