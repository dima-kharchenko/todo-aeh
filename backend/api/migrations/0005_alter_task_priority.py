# Generated by Django 5.2.1 on 2025-05-22 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_task_is_active_task_done'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='priority',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
