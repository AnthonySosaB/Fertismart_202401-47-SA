from django.urls import include, path
from rest_framework import routers

from .api import (
    ParameterViewSet, ParameterDetailViewSet
)

router = routers.DefaultRouter()
router.register(r'v1/parameter', ParameterViewSet)
router.register(r'v1/parameter_detail', ParameterDetailViewSet)


urlpatterns = [
    path('api/', include((router.urls, 'api'), namespace='api_enticen')),
]