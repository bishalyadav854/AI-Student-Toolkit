from django.urls import path
from toolkit.views import home, ai_api
urlpatterns = [path('', home), path('api/ai/', ai_api)]
