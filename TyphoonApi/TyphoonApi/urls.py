"""TyphoonApi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.schemas import get_schema_view
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from typhoon import views as ty_views


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register('users', ty_views.UserViewSet)
router.register('groups', ty_views.GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('docs/', get_schema_view()),
    path('api-auth/', include('rest_framework.urls')),
    path('tools/', include('tools.urls')),
    path('typhoon/', include('typhoon.urls'))
]