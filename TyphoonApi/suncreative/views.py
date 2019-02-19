from django.shortcuts import render

from django.conf import settings
from django.http import Http404
from django.db.models import Q, F, Sum, Avg
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from django.core.cache import cache
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import status, generics, permissions, views
from rest_framework.exceptions import APIException, PermissionDenied
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.filters import SearchFilter

from base.views import UnActiveModelMixin
from .models import *
from .serializers import *


# Create your views here.


class ArticleView(generics.ListAPIView):
    """
    API : Get Article
    """
    pagination_class = LimitOffsetPagination
    LimitOffsetPagination.default_limit = 20
    serializer_class = ArticleSerializer
    queryset = PostRecord.objects.all()
    filter_fields = ('category',)
    filter_backends = (SearchFilter,)
    search_fields = ('title', 'explanation', 'content')


class AdminArtcileView(generics.ListCreateAPIView):
    """
    API : Admin Manage Article
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = ArticleSerializer
    queryset = PostRecord.objects.all()
    filter_fields = ('category',)
    filter_backends = (SearchFilter,)
    search_fields = ('title', 'explanation', 'content')

    def post(self, request, *args, **kwargs):
        data = request.data
        data.creator = self.request.user
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AdminArtcileDetailView(UnActiveModelMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    API : 修改删除 Article
    """
    serializer_class = ArticleDetailSerializer
    queryset = PostRecord.objects.all()
    lookup_field = 'uuid'
