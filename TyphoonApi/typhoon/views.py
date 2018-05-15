from django.http import HttpResponse
from django.utils.six import BytesIO
from django.shortcuts import render
from django.contrib.auth.models import User, Group

from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import UserSerializer, GroupSerializer

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
