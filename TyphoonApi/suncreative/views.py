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

from django.utils.safestring import mark_safe
from unidecode import unidecode
import time
import traceback
import re
import unicodedata

CATEGORY_LIST = ['commercial', 'research', 'art']

def formatUnidecode(str):
  value = unidecode(str)
  value = re.sub('[^\w\s-]', '', value).strip().lower()
  value = mark_safe(re.sub('[-\s]+', '-', value))
  return value.lower()

# Create your views here.


class ArticleView(generics.ListAPIView):
    """
    API : Get Article
    """
    pagination_class = LimitOffsetPagination
    LimitOffsetPagination.default_limit = 20
    serializer_class = ArticleSerializer
    queryset = PostRecord.objects.filter(is_active=True, category__in=CATEGORY_LIST).order_by('-sort_index')
    filter_fields = ('category',)
    filter_backends = (SearchFilter,)
    search_fields = ('title', 'explanation', 'content')
    ordering_fields = ('sort_index', 'name')


class ArticleDetailView(generics.RetrieveUpdateAPIView):
    """
    API : Get Article Detail
    """
    serializer_class = ArticleDetailSerializer
    queryset = PostRecord.objects.all()
    lookup_field = 'url_params'


class AdminArtcileView(generics.ListCreateAPIView):
    """
    API : Admin Manage Article
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = ArticleSerializer
    admin_category_list = CATEGORY_LIST
    admin_category_list.append('invisible')
    queryset = PostRecord.objects.filter(is_active=True, category__in=admin_category_list).order_by('-sort_index')
    filter_fields = ('category',)
    filter_backends = (SearchFilter,)
    search_fields = ('title', 'explanation', 'content', 'url_params')
    ordering_fields = ('sort_index',)

    def create(self, request, *args, **kwargs):
        if type(request.data) != dict: request.data._mutable = True
        request.data['creator'] = self.request.user.id

        request.data['url_params'] = time.time()
        string = formatUnidecode(self.request.data.get('title'))
        try:
            if string:
                request.data['url_params'] = string if len(PostRecord.objects.filter(url_params=string)) < 1 else string + '-' + str(len(PostRecord.objects.filter(url_params=string)) + 1)
        except:
            traceback.print_exc()

        serializer = ArticleDetailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AdminArtcileDetailView(UnActiveModelMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    API : 修改删除 Article
    """
    permission_classes = (permissions.IsAdminUser,)

    serializer_class = ArticleDetailSerializer
    queryset = PostRecord.objects.all()
    lookup_field = 'uuid'
