import datetime
from django.conf import settings
from django.core.cache import cache
from django.utils.translation import ugettext_lazy as _
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication

EXPIRE_DAYS = getattr(settings, 'REST_FRAMEWORK_TOKEN_EXPIRE_DAYS', 1)

class ExpiringTokenAuthentication(TokenAuthentication):

    def authenticate_credentials(self, key):
        # cache_user = cache.get('token_' + key)
        # if cache_user:
        #     return (cache_user, key)
        
        model = self.get_model()
        try:
            token = model.objects.get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        time_now = datetime.datetime.now()
        token.created = token.created.replace(tzinfo=None)
        # token.delete()
        if token.created < time_now - datetime.timedelta(days=EXPIRE_DAYS):
            token.delete()
            raise exceptions.AuthenticationFailed('Token has expired')

        if token:
            cache.set('token_' + key, token.user, EXPIRE_DAYS * 24 * 60 * 60)

        return (token.user, token)
