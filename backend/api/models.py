from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField(max_length=255)
    done = models.BooleanField(default=False)
    category = models.TextField(blank=True, null=True, max_length=100)
    deadline = models.DateTimeField(blank=True, null=True)
    priority = models.IntegerField(default=0, validators=[MaxValueValidator(3), MinValueValidator(0)])
