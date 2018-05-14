from django.http import HttpResponse
import qrcode
from django.utils.six import BytesIO
import urllib

def urlencode(str):
  return urllib.parse.quote_plus(str)


def urldecode(str):
  return urllib.parse.unquote_plus(str)


def generate_qrcode(request, url):
    url = urldecode(url)
    img = qrcode.make(url)
    
    buf = BytesIO()
    img.save(buf)
    image_stream = buf.getvalue()

    response = HttpResponse(image_stream, content_type="image/png")
    return response

def init_qrcode(request):
    url = "https://blog.dubhee.com"
    img = qrcode.make(url)
    
    buf = BytesIO()
    img.save(buf)
    image_stream = buf.getvalue()

    response = HttpResponse(image_stream, content_type="image/png")
    return response
