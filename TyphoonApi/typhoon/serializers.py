from django.contrib.auth.models import User, Group
from .models import Typhoon, Point, GraphPoint
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class TyphoonListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Typhoon
        fields = ('num', 'name', 'englishname', 'startat', 'endat', 'year')
        lookup_field = 'year'


class PointListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    ename = serializers.SerializerMethodField()
    isdelete = serializers.SerializerMethodField()

    class Meta:
        model = Point
        fields = ('name', 'ename', 'typhoonnumber', 'happenedat', 'typhoontime', 'latitude', 'longitude', 'intensity', 'windspeed', 'airpressure', 'ordinarywindspeed', 'isdelete')
        lookup_field = 'typhoonnumber'

    def get_name(self, obj):
        return obj.typhoonnumber.name

    def get_ename(self, obj):
        return obj.typhoonnumber.englishname

    def get_isdelete(self, obj):
        return obj.typhoonnumber.is_delate

class TyphoonGraphDetailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GraphPoint
        fields = ('typhoonnumber', 'happenedat', 'typhoontime', 'latitude', 'longitude', 'intensity', 'windspeed', 'airpressure', 'ordinarywindspeed')
