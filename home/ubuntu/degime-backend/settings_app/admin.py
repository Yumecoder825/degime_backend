from django.contrib import admin
from .models import ProjectSettings

@admin.register(ProjectSettings)
class ProjectSettingsAdmin(admin.ModelAdmin):
    list_display = ('start_date', 'end_date')
