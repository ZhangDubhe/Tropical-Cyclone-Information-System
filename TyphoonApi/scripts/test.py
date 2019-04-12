# -*- coding:utf-8 -*-

from django.utils.safestring import mark_safe
from unidecode import unidecode
import re
import unicodedata


def formatUnidecode(str):
  value = unidecode(str)
  value = re.sub('[^\w\s-]', '', value).strip().lower()
  value = mark_safe(re.sub('[-\s]+', '-', value))
  print(value.lower())
  return value.lower()


value = unidecode("中文 URL 能生成拼音的吗?" + u"")
value = re.sub('[^\w\s-]', '', value).strip().lower()
value = mark_safe(re.sub('[-\s]+', '-', value))

print(value.lower())

value = unidecode("english url, does this tool can generate it?")
value = re.sub('[^\w\s-]', '', value).strip().lower()
value = mark_safe(re.sub('[-\s]+', '-', value))
print(value.lower())


formatUnidecode('孙雅兰同学')
formatUnidecode('hello world')


import sys
import os
import django
import ssl
import json
ssl._create_default_https_context = ssl._create_unverified_context

sys.path.append('..')
os.environ['DJANGO_SETTINGS_MODULE'] = 'TyphoonApi.settings'
django.setup()

from suncreative.models import PostRecord

articles = PostRecord.objects.filter(url_params='zheng-shi-ce-shi')
articles_len = len(articles)
article_index = 1
for article in articles:
  print(article.url_params)
  article.url_params = formatUnidecode(article.title)
  if articles_len > 1:
    article.url_params += '_' + str(article_index)
    article_index += 1
  article.save()
  print('Save:', article.url_params)
