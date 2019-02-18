from django.contrib import admin
from django.urls import include, path

from . import views

from rest_framework import routers

urlpatterns = [
    path('article', views.ArticleView.as_view()),
    path('article-admin', views.AdminArtcileView.as_view()),
]
