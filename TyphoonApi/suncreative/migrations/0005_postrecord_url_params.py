# Generated by Django 2.2 on 2019-04-13 03:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suncreative', '0004_postrecord_theme_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='postrecord',
            name='url_params',
            field=models.CharField(db_index=True, default='hello-world', max_length=200, null=True),
        ),
    ]
