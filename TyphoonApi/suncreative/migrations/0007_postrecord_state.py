# Generated by Django 2.2.13 on 2021-02-28 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suncreative', '0006_articlemediause_categorys_media_postcategory'),
    ]

    operations = [
        migrations.AddField(
            model_name='postrecord',
            name='state',
            field=models.IntegerField(default=1),
        ),
    ]
