# Generated by Django 4.2.5 on 2023-12-01 22:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_remove_complaintentry_downvote_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='product_photo',
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='product_photos/')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='mainapp.product')),
            ],
        ),
    ]