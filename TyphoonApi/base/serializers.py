from rest_framework import serializers
from django.contrib.auth.models import Group
from base.models import User, UserInfo


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name', 'user')


class AdminUSerSerializer(serializers.HyperlinkedModelSerializer):
    """
    管理员用户基本序列化器
    """
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class UserSerializer(AdminUSerSerializer):
    """
    普通用户基本序列化器
    """
    class Meta:
        model = User
        fields = ('uuid', 'username', 'nick_name',
                  'avatar_url', 'is_subscribed', 'groups')


class UserInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('user', 'sex', 'city')

