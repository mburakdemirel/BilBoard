# Generated by Django 4.2.6 on 2023-12-14 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0016_notification'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.CharField(blank=True, choices=[('electronics', 'Electronics'), ('book', 'Book'), ('household', 'Household'), ('clothing_accessories', 'Clothing & Accessories'), ('toys_games', 'Toys & Games'), ('sports', 'Sports'), ('art', 'Art'), ('other', 'Other')], max_length=30, null=True),
        ),
    ]
