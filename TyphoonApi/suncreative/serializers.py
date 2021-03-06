from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import PostRecord, Media, MediaFolder


class ArticleSerializer(serializers.ModelSerializer):
    # creator = serializers.CharField(source='creator.nick_name', required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = PostRecord
        fields = ('uuid', 'title', 'explanation', 'header_image', 'url_params',
                  'created_at', 'sort_index', 'category', 'thumbnail', 'theme_color', 'state')
        # exclude = ('id', )


class ArticleDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostRecord
        exclude = ('id', )


class MediaFoldersSerializer(serializers.ModelSerializer):
    medias = serializers.SerializerMethodField()

    class Meta:
        model = MediaFolder
        exclude = ()

    def get_medias(self, obj):
        return len(Media.objects.filter(folder=obj))


class MediaFolderDetailSerializer(serializers.ModelSerializer):
    medias = serializers.SerializerMethodField()

    class Meta:
        model = MediaFolder
        exclude = ()

    def get_medias(self, obj):
        return len(Media.objects.filter(folder=obj))


class MediaSerializer(serializers.ModelSerializer):
    folder = MediaFolderDetailSerializer(read_only=True)

    class Meta:
        model = Media
        exclude = ('id', )

