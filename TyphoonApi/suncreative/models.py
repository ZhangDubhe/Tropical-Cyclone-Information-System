import uuid
from django.db import models
from base.models import User
# Create your models here.
## assets


class TimeStampedModel(models.Model):
    """ TimeStampedModel
    An abstract base class model that provides self-managed "created" and "modified" fields.
    """
    uuid = models.UUIDField(
        auto_created=True, default=uuid.uuid4, editable=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        get_latest_by = 'updated_at'
        ordering = ('-created_at', '-updated_at',)
        abstract = True


class PostRecord(TimeStampedModel):
    """ PostRecordModel
    文章历史
    """
    title = models.CharField(max_length=100, null=True)
    explanation = models.CharField(max_length=5000, null=True)
    thumbnail = models.URLField(null=True)  # 缩略图
    header_image = models.URLField(null=True)  # 头图
    content = models.TextField()  # 内容
    sort_index = models.IntegerField(auto_created=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'sun_article_info'
