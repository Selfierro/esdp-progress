# Generated by Django 5.0.3 on 2024-05-14 23:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='price',
            field=models.CharField(blank=True, null=True, verbose_name='Цена'),
        ),
    ]
