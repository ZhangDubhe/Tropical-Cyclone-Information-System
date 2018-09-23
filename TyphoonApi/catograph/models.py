from django.db import models
from base.models import User, TimeStampedModel
# Create your models here.


class Friendship(TimeStampedModel):
    """
    用户与用户之间的关注和互粉的关系表
    """
    from_friend = models.ForeignKey(User, related_name='following', on_delete=None)
    to_friend = models.ForeignKey(User, related_name='follower', on_delete=None)
    
    class Meta:
      db_table = 'user_cato_friendship'
