from django.http import HttpResponse
from django.utils.six import BytesIO
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, views
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination

from .serializers import *
from .models import *
import json


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TyphoonList(generics.ListCreateAPIView):
    """
    API : get typhoon year by selected year
    """
    queryset = Typhoon.objects.all()
    serializer_class = TyphoonListSerializer

    def get_queryset(self):
        year = self.request.query_params.get("year", None)
        if year is not None:
            self.queryset = self.queryset.filter(year=year)
        return self.queryset.order_by('-startat')

class YearList(views.APIView):
    """
    API : get list of year totally
    """
    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        year_list = Typhoon.objects.all().values('year').annotate(count=Count('year')).order_by('year')
        return Response(year_list)

    def get_queryset(self):
        year_list = Typhoon.objects.values('year').annotate(Count('num'))
        return year_list

class PointList(generics.ListAPIView):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Point.objects.all()
    serializer_class = PointListSerializer

    def get_queryset(self):
        num = self.request.query_params.get("typhoonnumber", None)
        typhoon = Typhoon.objects.get(num=num)
        if num is not None:
            self.queryset = self.queryset.filter(typhoonnumber=num)
        return self.queryset.order_by('happenedat')

class GraphPointList(generics.ListAPIView):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = GraphPoint.objects.all()
    serializer_class = TyphoonGraphDetailSerializer

    def get_queryset(self):
        num = self.request.query_params.get("typhoonnumber", None)
        if num is not None:
            self.queryset = self.queryset.filter(typhoonnumber=num)
        return self.queryset.order_by('happenedat')
