# Generated by Django 3.1.3 on 2021-01-10 13:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_auto_20210110_1224'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='discontinued',
        ),
    ]
