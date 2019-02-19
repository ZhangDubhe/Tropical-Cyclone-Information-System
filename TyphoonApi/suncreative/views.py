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

from .models import *
from .serializers import *


# Create your views here.


class ArticleView(generics.ListAPIView):
    pagination_class = LimitOffsetPagination
    LimitOffsetPagination.default_limit = 20
    serializer_class = ArticleSerializer
    queryset = PostRecord.objects.all()


class AdminArtcileView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = ArticleSerializer
    queryset = PostRecord.objects.all()

