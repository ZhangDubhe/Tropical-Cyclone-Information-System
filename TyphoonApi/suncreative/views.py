from django.shortcuts import render

from django.conf import settings
from django.http import Http404
from django.db.models import Q, F, Sum, Avg
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from django.core.cache import cache
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django_filters.rest_framework import DjangoFilterBackend
from pagination import BasePageNumberPagination

from rest_framework import status, generics, permissions, views
from rest_framework.exceptions import APIException, PermissionDenied
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.filters import SearchFilter

from base.views import UnActiveModelMixin
from .models import *
from .serializers import *
from tools.views import BaseUploadFileView

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
    queryset = PostRecord.objects.filter(
        is_active=True, category__in=CATEGORY_LIST).order_by('-sort_index')
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
    queryset = PostRecord.objects.filter(
        is_active=True, category__in=admin_category_list).order_by('-sort_index')
    filter_fields = ('category',)
    filter_backends = (SearchFilter,)
    search_fields = ('title', 'explanation', 'content', 'url_params')
    ordering_fields = ('sort_index',)

    def create(self, request, *args, **kwargs):
        if type(request.data) != dict:
            request.data._mutable = True
        request.data['creator'] = self.request.user.id

        request.data['url_params'] = time.time()
        string = formatUnidecode(self.request.data.get('title'))
        try:
            if string:
                request.data['url_params'] = string if len(PostRecord.objects.filter(
                    url_params=string)) < 1 else string + '-' + str(len(PostRecord.objects.filter(url_params=string)) + 1)
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


class AdminMediaFoldersView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = MediaFoldersSerializer
    queryset = MediaFolder.objects.filter(is_active=True, )
    filter_backends = (DjangoFilterBackend,)

    def post(self, request, *args, **kwargs):
        if len(MediaFolder.objects.filter(name=request.data.get('name'), is_active=False)) > 0:
            ins = MediaFolder.objects.get(name=request.data.get('name'))
            ins.is_active = True
            ins.save()
            serializer = MediaFoldersSerializer(ins)
            return Response(data=serializer.data)
        else:
            return self.create(request, *args, **kwargs)


class AdminMediaFolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API : 修改删除 MediaFolder
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = MediaFoldersSerializer
    queryset = MediaFolder.objects.filter(is_active=True, )
    lookup_field = 'name'

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        mentions = Media.objects.filter(folder=instance)
        print(mentions)
        for each in mentions:
            each.folder = None
            each.save()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminMediaListView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = MediaSerializer
    queryset = Media.objects.filter(is_active=True, )
    filter_backends = (SearchFilter, DjangoFilterBackend)
    filter_fields = ('name', 'oss_path', 'folder')
    search_fields = ('$name', '$oss_path', '$folder__name')
    pagination_class = BasePageNumberPagination

    def post(self, request, *args, **kwargs):
        formatted_data = request
        file_folder_id = request.data.get('folder_id')
        oss_path = request.data.get('folder_name')
        name = request.data.get('identifier')
        suffix = request.FILES['file'].name.split('.')[1]

        if oss_path and oss_path[0] == '/':
            return Response(data="文件夹不能以斜杠开头", status=status.HTTP_400_BAD_REQUEST)

        formatted_data.data['file_type'] = '{}/{}'.format('sun/medias', oss_path)
        formatted_data.data['identifier'] = '{}.{}'.format(name, suffix)
        # 检测是否存在同名
        query_set = Media.objects.filter(is_active=True, name=name, oss_path=oss_path)
        if len(query_set):
            # raise Exception('Already had name and folder')
            return Response(data="命名和文件夹已存在，请更换", status=status.HTTP_409_CONFLICT)

        upload_res = BaseUploadFileView.post(self, formatted_data, args, kwargs)
        if type(upload_res) is Exception or upload_res.status_code != 201:
            return upload_res
        res_url = upload_res.data
        ser_data = {
            'oss_path': oss_path,
            'name': name,
            'type': request.data.get('type'),
            'url': res_url
        }
        folder_ins = None
        if file_folder_id and file_folder_id is not None:
            folder_ins = MediaFolder.objects.get(id=int(file_folder_id))
        media_serializer = MediaSerializer(data=ser_data)
        media_serializer.is_valid(raise_exception=True)
        media_serializer.save(creator=self.request.user, folder=folder_ins)
        # self.perform_create(media_serializer)
        headers = self.get_success_headers(media_serializer.data)
        return Response(media_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AdminMediaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API : 修改删除 media
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = MediaDetailSerializer
    queryset = Media.objects.filter(is_active=True, )
    lookup_field = 'uuid'
