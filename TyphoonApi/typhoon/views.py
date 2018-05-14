from django.http import HttpResponse
import qrcode
from django.utils.six import BytesIO
from django.shortcuts import render
from rest_framework.views import APIView

def query_year(request, year):
    print(type(year))

    response = 'This is data'
    return response

def query_all(request, data):
    response = 'This is all data'
    return response
