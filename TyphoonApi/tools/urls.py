from django.contrib import admin
from django.urls import include, path
from tools.wechat.mp import *
from tools.wechat.mina import *
from . import views

urlpatterns = [
    path('qrcode/<path:url>', views.generate_qrcode, name='qr_code'),
    path('qrcode/', views.init_qrcode, name='init_qr_code'),
    path('wechat/mp', views.init_qrcode, name='mp'),
    path('wechat/mina', views.init_qrcode, name='mina'),
    path('upload-image/', views.BaseUploadImageView.as_view(), name='upload_image'),
    path('upload-file/', views.BaseUploadFileView.as_view(), name='upload_file'),
]
