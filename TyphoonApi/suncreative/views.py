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

    def list(self, request, *args, **kwargs):
        try:
            seminar_student = PostRecord.objects.get(uuid=self.kwargs.get('uuid').replace('-', ''))
        except:
            raise ObjectDoesNotExist('SeminarStudent')

        # if self.request.user:
        #     raise PermissionDenied()

        queryset = PostRecord.objects
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AdminArtcileView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = ArticleSerializer
