"""
URL configuration for config_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi

from enticen.api import ManyParameters
from segcen.api import CustomObtainAuthToken, CustomRegisterUser

schema_view = get_schema_view(
   openapi.Info(
      title="FertiSmart 1.0 API",
      default_version='v1',
      description="FertiSmart 1.0"
   ),
   public=True,
   permission_classes=(permissions.IsAdminUser,),
)

urlpatterns = [
   path('admin/', admin.site.urls),
   path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
   path('api/token-auth/', CustomObtainAuthToken.as_view(), name='token_auth'),
   path('api/register-user/', CustomRegisterUser.as_view(), name='register_user'),
   path('api/many_parameters/', ManyParameters.as_view(), name='many_parameters'),
   path('segcen/', include('segcen.urls')),
   path('enticen/', include('enticen.urls')),
   path('fertismart/', include('fertismart.urls')),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
