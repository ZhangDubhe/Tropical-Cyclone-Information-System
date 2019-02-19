import django
import sys
import os

sys.path.append('..')  # TODO: change the path
os.environ['DJANGO_SETTINGS_MODULE'] = 'TyphoonApi.settings'
django.setup()


from rest_framework.authtoken.models import Token
from base.models import *


for user in User.objects.all():
    Token.objects.get_or_create(user=user)
