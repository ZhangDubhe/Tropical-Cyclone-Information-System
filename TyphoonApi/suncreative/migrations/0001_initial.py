# Generated by Django 2.0.4 on 2019-02-18 09:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PostRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sort_index', models.IntegerField(auto_created=True)),
                ('uuid', models.UUIDField(auto_created=True, db_index=True, default=uuid.uuid4, editable=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('title', models.CharField(max_length=100, null=True)),
                ('explanation', models.CharField(max_length=5000, null=True)),
                ('thumbnail', models.URLField(null=True)),
                ('header_image', models.URLField(null=True)),
                ('content', models.TextField()),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'sun_article_info',
            },
        ),
    ]
