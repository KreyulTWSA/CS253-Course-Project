# Generated by Django 5.1.7 on 2025-04-12 21:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orders', '0001_initial'),
        ('stores', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='store',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stores.store'),
        ),
    ]
