import os
import json
import datetime

from django.http import HttpResponse
from django.utils.six import BytesIO
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, views
from rest_framework import generics
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from TyphoonApi.authentication import ExpiringTokenAuthentication
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
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    serializer_class = AdminUSerSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    authentication_classes = (ExpiringTokenAuthentication)
    permission_classes = (IsAuthenticated,)
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class UserTokenViewSet(ObtainAuthToken):
    """
    给用户添加认证 token
    """
    def post(self, request, *args, **kwargs):
        if request.data.__contains__('username') and request.data.__contains__('password'):
            data = {
                'username': request.data['username'],
                'password': request.data['password']
            }
        else:
            raise APIException('ParamsError', -1)

        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            # user = token.user
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            time_now = datetime.datetime.now()

            if not created:
                # update the created time of the token to keep it valid
                token.created = time_now
                token.save()

            return Response({
                    "username": user.username,
                    "token": token.key,
                    "id": user.id,
                })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    authentication_classes = (ExpiringTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True).order_by('-id')


class UserSelfDetailView(UnActiveModelMixin, generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (ExpiringTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
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

