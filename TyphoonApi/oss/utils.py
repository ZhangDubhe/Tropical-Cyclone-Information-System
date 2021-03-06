import oss2
from django.conf import settings

OSS_CONFIG = getattr(settings, 'OSS_CONFIG', 1)


def get_auth():
    print('auth')
    auth = oss2.Auth(OSS_CONFIG['ACCESS_KEY_ID'], OSS_CONFIG['ACCESS_KEY_SECRET'])
    return auth


def get_bucket():
    print('bucket')
    auth = get_auth()
    bucket = oss2.Bucket(auth, OSS_CONFIG['ENDPOINT'], OSS_CONFIG['BUCKET_STATIC'])
    return bucket


def format_key(file_type, name):
    return '{}/{}'.format(file_type, name)


def format_url(key):
    return 'https://{}/{}'.format(OSS_CONFIG['STATIC_URL'], key)


def upload_file(cache_file, file_type, name, suffix=None):
    # 第二个遵从 xxx-image 类似
    if suffix:
        name = '{}.{}'.format(name, suffix)
    bucket = get_bucket()
    object_key = format_key(file_type, name)
    url = format_url(object_key)

    try:
        bucket.put_object(object_key, cache_file, )
    except:
        raise Exception(IOError)

    return url
