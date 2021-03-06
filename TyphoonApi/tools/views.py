import json
import random
import oss2
import traceback
import requests
import time
import os

import qrcode
import urllib

from django.conf import settings
from django.http import HttpResponse
from django.utils.six import BytesIO

from rest_framework import status, generics, permissions, views, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from oss.utils import upload_file


def urlencode(str):
  return urllib.parse.quote_plus(str)


def urldecode(str):
  return urllib.parse.unquote_plus(str)


def generate_qrcode(request, url):
    url = urldecode(url)
    img = qrcode.make(url)
    
    buf = BytesIO()
    img.save(buf)
    image_stream = buf.getvalue()

    response = HttpResponse(image_stream, content_type="image/png")
    return response

def init_qrcode(request):
    url = "https://blog.dubhee.com"
    img = qrcode.make(url)
    
    buf = BytesIO()
    img.save(buf)
    image_stream = buf.getvalue()

    response = HttpResponse(image_stream, content_type="image/png")
    return response


class BaseUploadImageView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **kwargs):
        try:
            image_file = request.data['file']
        except:
            return Response('IO Error', status=status.HTTP_400_BAD_REQUEST)
        print(request.data)
        image_type = request.data.get('image_type')
        identifier = request.data.get('identifier')

        if not image_type or not identifier:
            return Response('Params Error', status=status.HTTP_400_BAD_REQUEST)

        url = None
        OSS_CONFIG = getattr(settings, 'OSS_CONFIG', 1)
        auth = oss2.Auth(OSS_CONFIG['ACCESS_KEY_ID'], OSS_CONFIG['ACCESS_KEY_SECRET'])
        bucket = oss2.Bucket(auth, OSS_CONFIG['ENDPOINT'], OSS_CONFIG['BUCKET_STATIC'])
        try:
            bucket.put_object(image_type + '-image/' + identifier + '.jpg', image_file)
            url = 'https://{}/{}-image/{}.jpg'.format(OSS_CONFIG['STATIC_URL'], image_type, identifier)
        except:
            return Response('Bucket IO Error', status=status.HTTP_400_BAD_REQUEST)

        return Response(url)


class BaseUploadFileView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **kwargs):
        try:
            cache_file = request.data.get('file')
        except:
            return Response('IO Error', status=status.HTTP_400_BAD_REQUEST)

        file_type = request.data.get('file_type')
        identifier = request.data.get('identifier')

        if not identifier:
            identifier = request.FILES['file'].name
        if not cache_file or not identifier:
            return Response('Params Error', status=status.HTTP_400_BAD_REQUEST)

        try:
            url = upload_file(cache_file, file_type, identifier)
        except:
            return Response('Bucket IO Error', status=status.HTTP_400_BAD_REQUEST)
        return Response(url, status.HTTP_201_CREATED)
