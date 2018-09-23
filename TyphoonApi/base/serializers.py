from rest_framework import serializers
from django.contrib.auth.models import Group
from base.models import User, UserInfo


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('uuid','username','nick_name', 'avatar_url', 'is_subscribed', 'groups')


class UserInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('user', 'sex', 'city')

