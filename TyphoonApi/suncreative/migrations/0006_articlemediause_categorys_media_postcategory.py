# Generated by Django 2.2.13 on 2021-01-24 12:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('suncreative', '0005_postrecord_url_params'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categorys',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
            ],
            options={
                'db_table': 'sun_categorys',
            },
        ),
        migrations.CreateModel(
            name='PostCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='suncreative.Categorys')),
                ('post', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='suncreative.PostRecord')),
            ],
        ),
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(auto_created=True, db_index=True, default=uuid.uuid4, editable=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(max_length=20)),
                ('url', models.CharField(max_length=300)),
                ('oss_path', models.CharField(max_length=100)),
                ('creator', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-created_at', '-updated_at'),
                'get_latest_by': 'updated_at',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ArticleMediaUse',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(auto_created=True, db_index=True, default=uuid.uuid4, editable=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='suncreative.PostRecord')),
                ('media', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='suncreative.Media')),
            ],
            options={
                'ordering': ('-created_at', '-updated_at'),
                'get_latest_by': 'updated_at',
                'abstract': False,
            },
        ),
    ]
