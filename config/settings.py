from pathlib import Path
from dotenv import load_dotenv
import os
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-only-change-me')
DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1','localhost']
INSTALLED_APPS = ['django.contrib.contenttypes','django.contrib.staticfiles','toolkit']
MIDDLEWARE = ['django.middleware.security.SecurityMiddleware','django.middleware.common.CommonMiddleware']
ROOT_URLCONF = 'config.urls'
TEMPLATES = [{'BACKEND':'django.template.backends.django.DjangoTemplates','DIRS':[BASE_DIR/'templates'],'APP_DIRS':True,'OPTIONS':{'context_processors':[]}}]
WSGI_APPLICATION = 'config.wsgi.application'
DATABASES = {'default': {'ENGINE':'django.db.backends.sqlite3','NAME':BASE_DIR/'db.sqlite3'}}
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR/'static']
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY','')
