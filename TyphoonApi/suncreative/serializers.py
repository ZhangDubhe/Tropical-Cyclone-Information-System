from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import PostRecord


class ArticleSerializer(serializers.ModelSerializer):
    vaps = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PostRecord
        fields = ('uuid', 'title', 'explanation', 'header_image', 'content')

    def get_(self, obj):
        queryset = VapCron.objects.filter(seminar=obj, status__gte=0).exclude(status=999).order_by('-id')
        serializer = VapCronShortSerializer(queryset, many=True)
        return serializer.data

