from django.contrib import admin
from django.urls import include, path

from . import views

from rest_framework import routers

urlpatterns = [
    path('user/', views.UserSelfDetailView.as_view()),
    path('user-list/', views.UserListView.as_view())
]
