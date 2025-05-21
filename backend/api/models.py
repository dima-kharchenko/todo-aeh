from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField(max_length=255)
    category = models.TextField(blank=True, null=True, max_length=100)
    deadline = models.DateTimeField(blank=True, null=True)
