from django.urls import path
from django.contrib.staticfiles.views import serve
from django.http import FileResponse
from django.contrib.staticfiles import finders
from toolkit.views import home, ai_api

def serve_service_worker(request):
    """Serves sw.js from static/js/sw.js with correct JS mime type and root scope headers"""
    file_path = finders.find('js/sw.js')
    response = FileResponse(open(file_path, 'rb'), content_type='application/javascript')
    # Allows the service worker to control all routes starting from '/'
    response['Service-Worker-Allowed'] = '/'
    return response

def serve_manifest(request):
    """Serves manifest.json from static/manifest.json"""
    file_path = finders.find('manifest.json')
    return FileResponse(open(file_path, 'rb'), content_type='application/manifest+json')

urlpatterns = [
    path('', home, name='home'),
    path('api/ai/', ai_api, name='ai_api'),

    # Served at root URL while reading from static files
    path('sw.js', serve_service_worker, name='sw_js'),
    path('manifest.json', serve_manifest, name='manifest_json'),
]