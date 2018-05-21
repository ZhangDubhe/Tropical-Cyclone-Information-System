from django.contrib import admin
from django.urls import include, path

from . import views

from rest_framework import routers

urlpatterns = [
    path('total', views.YearList.as_view()),
    path('lists', views.TyphoonList.as_view()),
    path('points', views.PointList.as_view()),
    path('graphpoints', views.GraphPointList.as_view()),
]
