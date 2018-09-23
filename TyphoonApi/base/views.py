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


class UnActiveModelMixin(object):
    """ 
    删除一个对象，并不真删除，级联将对应外键对象的is_active设置为false，需要外键对象都有is_active字段.
    """

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


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


class UserSelfDetailView(UnActiveModelMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True).order_by('-id')
    # def get_extra_actions():


    def get_object(self):
        return User.objects.get(id=self.request.user.id)


class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True).order_by('-id')
    lookup_field = 'uuid'

    def perform_update(self, serializer):
        parent_group = Group.objects.get(name='base')
        instance = self.get_object()
        instance.groups.remove(parent_group)
        instance.save()

