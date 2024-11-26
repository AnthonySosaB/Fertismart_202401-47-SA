"""
Django settings for config_project project.

Generated by 'django-admin startproject' using Django 4.2.15.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os
import environ

# import pymysql
# pymysql.version_info = (1, 4, 2, "final", 0)
# pymysql.install_as_MySQLdb()

env = environ.Env()
environ.Env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-l28xkrt1i_(z^5yb4#a((pai%!1pk&0w#v7k!*mfxy5nrq8a#2"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'dev.app.fertismart.lat', 'api.fertismart.lat']


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_api_key",
    "drf_yasg",
    "corsheaders",
    "import_export",
    "django_filters",
    "segcen",
    "enticen",
    "fertismart",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / 'templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config_project.wsgi.application"
SITE_ID = 1

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
BD_HOST = None if 'BD_HOST' not in env else env('BD_HOST')
BD_NAME = None if 'BD_NAME' not in env else env('BD_NAME')
BD_USER = None if 'BD_USER' not in env else env('BD_USER')
BD_PASS = None if 'BD_PASS' not in env else env('BD_PASS')
BD_PORT = None if 'BD_PORT' not in env else env('BD_PORT')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': BD_HOST,
        'NAME': BD_NAME,
        'USER': BD_USER,
        'PASSWORD': BD_PASS,
        'PORT': ''
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

PROJECT_APP_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_APP = os.path.basename(PROJECT_APP_PATH)
PROJECT_ROOT = BASE_DIR = os.path.dirname(PROJECT_APP_PATH)

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(PROJECT_ROOT, STATIC_URL.strip("/"))

MEDIA_URL = '/upload/'
MEDIA_ROOT = os.path.join(PROJECT_ROOT, MEDIA_URL.strip("/"))

PREDICT_URL = '/predict/'
PREDICT_ROOT = os.path.join(PROJECT_ROOT, PREDICT_URL.strip("/"))

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)

CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
)

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
REST_USE_JWT = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'config_permission.permissions.other_permissions.BaseSuperuserPermissions'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication'
    ],
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend']
}

CONS = {
    'GROUPS': {
        'SUPERUSER': 'Superuser',
        'AGRICULTOR': 'Agricultor',
        'SOPORTE': 'Soporte'
    }
}

# Configuraciones generales
FERTISMART_APP_URL = None if 'FERTISMART_APP_URL' not in env else env('FERTISMART_APP_URL')

# Credenciales para envio de correos
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.zoho.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = env('SMTP_USER_MAIL')
EMAIL_HOST_PASSWORD = env('SMTP_PASSWORD_MAIL')
EMAIL_USE_TLS = True

API_FAB_IDENTIFY_TOKEN = env('API_FAB_IDENTIFY_TOKEN')
API_FAB_IDENTIFY_DNI = env('API_FAB_IDENTIFY_DNI')
API_FAB_IDENTIFY_RUC = env('API_FAB_IDENTIFY_RUC')