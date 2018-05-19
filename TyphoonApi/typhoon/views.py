from django.http import HttpResponse
from django.utils.six import BytesIO
from django.shortcuts import render
from django.contrib.auth.models import User, Group

from rest_framework import viewsets
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import *
from .models import *
import qrcode
import json


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TyphoonList(generics.ListCreateAPIView):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Typhoon.objects.all()
    serializer_class = TyphoonListSerializer

    def get_queryset(self):
        return self.queryset.order_by('-num')



class TyphoonDetail(generics.ListCreateAPIView):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Point.objects.all()
    serializer_class = TyphoonListSerializer

    def get_queryset(self):
        return self.queryset.order_by('-happenedat')

def query_year(request, year):
    print(type(year))
    response = json.dumps({
        'year': year,
        'msg': 'This is data'
    })
    return response

def query_all(request):
    response = json.dumps({
        'year': 'all',
        'msg': 'This is data'
    })
    return response