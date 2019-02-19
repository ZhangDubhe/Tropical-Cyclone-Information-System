from django.contrib import admin
from django.urls import include, path

from . import views

from rest_framework import routers

router = routers.DefaultRouter()
router.register('user', views.UserViewSet)
router.register('group', views.GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth-user/', views.UserTokenViewSet.as_view()),
    path('user-detail/', views.UserSelfDetailView.as_view()),
    path('user-list/', views.UserListView.as_view())
]
