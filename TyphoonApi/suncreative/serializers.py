from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import PostRecord


class ArticleSerializer(serializers.ModelSerializer):
    # creator = serializers.CharField(source='creator.nick_name', required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = PostRecord
        fields = ('uuid', 'title', 'explanation', 'header_image', 'content',
                  'created_at', 'sort_index', 'creator', 'category', 'thumbnail', 'theme_color')
        # exclude = ('id', )


class ArticleDetailSerializer(serializers.ModelSerializer):

    class Meta():
        model = PostRecord
        exclude = ('id', )
