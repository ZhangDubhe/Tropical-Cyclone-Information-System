from django.contrib import admin
from django.urls import include, path
from tools.wechat.mp import *
from tools.wechat.mina import *
from . import views

urlpatterns = [
    path('qrcode/<path:url>', views.generate_qrcode, name='qrcode'),
    path('qrcode/', views.init_qrcode, name='initqrcode'),
    path('wechat/mp', views.init_qrcode, name='initqrcode'),
    path('wechat/mina', views.init_qrcode, name='initqrcode')
]
