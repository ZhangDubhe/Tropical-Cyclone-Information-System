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


class TyphoonListViewsetSerializer(serializers.HyperlinkedModelSerializer):
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
        fields = ('name', 'ename', 'typhoonnumber', 'happenedat', 'typhoontime', 'latitude', 'longitude',
                  'intensity',  'windspeed', 'airpressure', 'ordinarywindspeed', "is_change", 'isdelete')
        lookup_field = 'typhoonnumber'

    def get_name(self, obj):
        return obj.typhoonnumber.name

    def get_ename(self, obj):
        return obj.typhoonnumber.englishname

    def get_isdelete(self, obj):
        return obj.typhoonnumber.is_delate


class TyphoonGraphDetailSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    ename = serializers.SerializerMethodField()
    isdelete = serializers.SerializerMethodField()

    class Meta:
        model = GraphPoint
        fields = ('name', 'ename', 'typhoonnumber', 'happenedat',
                  'intensity', 'isdelete', "is_change")
        lookup_field = 'typhoonnumber'

    def get_name(self, obj):
        return obj.typhoonnumber.name

    def get_ename(self, obj):
        return obj.typhoonnumber.englishname

    def get_isdelete(self, obj):
        return obj.typhoonnumber.is_delate
