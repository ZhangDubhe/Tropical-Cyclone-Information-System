from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('qrcode/<path:url>', views.generate_qrcode, name='qrcode'),
    path('qrcode/', views.init_qrcode, name='initqrcode')
]
