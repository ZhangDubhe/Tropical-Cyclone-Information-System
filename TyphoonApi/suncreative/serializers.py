from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import PostRecord


class ArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostRecord
        fields = ('uuid', 'title', 'explanation', 'header_image', 'content')


