# Generated by Django 4.2.5 on 2023-12-01 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='complaintentry',
            name='downvote',
        ),
        migrations.RemoveField(
            model_name='complaintentry',
            name='upvote',
        ),
        migrations.AddField(
            model_name='complaintentry',
            name='vote',
            field=models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=6, null=True),
        ),
    ]