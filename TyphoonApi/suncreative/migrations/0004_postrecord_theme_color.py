# Generated by Django 2.0.4 on 2019-02-28 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suncreative', '0003_postrecord_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='postrecord',
            name='theme_color',
            field=models.CharField(default='#ffffff', max_length=30),
        ),
    ]
