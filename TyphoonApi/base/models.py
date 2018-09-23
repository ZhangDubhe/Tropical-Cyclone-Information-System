from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
# Create your models here.


class TimeStampedModel(models.Model):
    """ TimeStampedModel
    An abstract base class model that provides self-managed "created" and "modified" fields.
    """
    uuid = models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        get_latest_by = 'updated_at'
        ordering = ('-created_at', '-updated_at',)
        abstract = True


class AssetsModel(models.Model):
    """ AssetsModel
    An abstract base class model that provides "is_active" fields.
    """
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    uuid = models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, db_index=True)
    username = models.CharField(
        'username',
        max_length=32,
        unique=True,
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    first_name = models.CharField('first name', max_length=30, null=True, blank=True, default=None)
    last_name = models.CharField('last name', max_length=30, null=True, blank=True, default=None)
    mina_openid = models.CharField(max_length=32, null=True, db_index=True, default=None)
    mp_openid = models.CharField(max_length=32, null=True, db_index=True, default=None)
    union_id = models.CharField(max_length=32, null=True, db_index=True, default=None)
    nick_name = models.CharField(max_length=128, null=True, default=None)
    phone_number = models.CharField(max_length=20, null=True, db_index=True, default=None)
    state = models.PositiveSmallIntegerField(default=0)
    avatar_url = models.URLField(null=True, default=None)
    is_subscribed = models.BooleanField(default=True)
    class Meta:
        db_table = 'auth_user'


class UserInfo(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.PROTECT, primary_key=True, related_name='info')
    sex = models.PositiveSmallIntegerField(null=True)
    city = models.CharField(max_length=20, null=True)
    subscribe_at = models.PositiveIntegerField(null=True)
    unsubscribe_at = models.PositiveIntegerField(null=True)

    class Meta:
        db_table = 'user_info'
