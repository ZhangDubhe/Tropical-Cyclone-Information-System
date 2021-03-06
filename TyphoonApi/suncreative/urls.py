from django.contrib import admin
from django.urls import include, path

from . import views

from rest_framework import routers

urlpatterns = [
    path('article/', views.ArticleView.as_view()),
    path('article-admin/', views.AdminArtcileView.as_view()),
    path('article/<url_params>/', views.ArticleDetailView.as_view(), name='articleDetail'),
    path('article-admin/<uuid>/', views.AdminArtcileDetailView.as_view(), name='adminArticleDetail'),
    path('media-folders/', views.AdminMediaFoldersView.as_view(), name="mediaFolders"),
    path('media-folder/<name>/', views.AdminMediaFolderDetailView.as_view(), name="mediaFolderDetail"),
    path('medias/', views.AdminMediaListView.as_view()),
    path('media/<uuid>/', views.AdminMediaDetailView.as_view())
]
