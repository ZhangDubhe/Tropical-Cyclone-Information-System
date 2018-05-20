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
    class Meta:
        model = Point
        fields = ('typhoonnumber', 'happenedat', 'typhoontime', 'latitude', 'longitude', 'intensity', 'windspeed', 'airpressure', 'ordinarywindspeed')
        lookup_field = 'typhoonnumber'

class TyphoonGraphDetailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GraphPoint
        fields = ('typhoonnumber', 'happenedat', 'typhoontime', 'latitude', 'longitude', 'intensity', 'windspeed', 'airpressure', 'ordinarywindspeed')
