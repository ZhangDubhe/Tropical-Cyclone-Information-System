from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('year/<int:year>', views.query_year, name='years'),
    path('all/', views.query_all, name='all')
]
