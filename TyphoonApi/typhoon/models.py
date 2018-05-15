from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted((item, item) for item in get_all_styles())
# Create your models here.


class Typhoon(models.Model):
    num = models.IntegerField(primary_key=True)
    name = models.TextField(max_length=50)
    englishname = models.TextField(max_length=50)
    startat = models.DateTimeField()
    endat = models.DateTimeField()
    year = models.IntegerField()

    class Meta:
        ordering = ('year', 'num')

class Point(models.Model):
    typhoonnumber = models.ForeignKey('Typhoon', related_name='台风编号', on_delete=models.CASCADE)
    happenedat = models.DateTimeField()   # "1981-04-14 14:00:00"
    typhoontime = models.TextField(default='1953061506')

    latitude = models.FloatField(null=True, default=0)
    longitude = models.FloatField(null=True, default=0)
    intensity = models.FloatField(default=0)  # 强度等级
    windspeed = models.FloatField(default=0)  # 风速 2分钟平均近中心最大风速(MSW, m/s).
    airpressure = models.FloatField(default=0)  # 风压
    ordinarywindspeed = models.FloatField(default=0)  # 2分钟平均风速(m/s), 有两种情况:

    # "dtTrack": "/Date(-62135596800000+0800)/"
    class Meta:
        ordering = ('typhoonnumber', 'happenedat')


class GraphPoint(models.Model):
    typhoonnumber = models.ForeignKey('Typhoon', on_delete=models.CASCADE)
    happenedat = models.DateTimeField()   # "1981-04-14 14:00:00"
    typhoontime = models.TextField(default='1953061506')
    intensity = models.FloatField(default=0)  # 强度等级

    class Meta:
        ordering = ('typhoonnumber', 'happenedat')


# 关于强度的解释
# 0 - 弱于热带低压(TD), 或等级未知,
# 1 - 热带低压(TD, 10.8-17.1m/s),
# 2 - 热带风暴(TS, 17.2-24.4 m/s),
# 3 - 强热带风暴(STS, 24.5-32.6 m/s),
# 4 - 台风(TY, 32.7-41.4 m/s),
# 5 - 强台风(STY, 41.5-50.9 m/s),
# 6 - 超强台风(SuperTY, ≥51.0 m/s),
# 9 - 变性, 第一个标记表示变性完成.
