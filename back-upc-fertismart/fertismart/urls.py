from django.urls import include, path
from rest_framework import routers
from django.conf.urls import url

from .api import *

router = routers.DefaultRouter()
router.register(r'v1/campo', CampoViewSet)
router.register(r'v1/tipo-suelo', TipoSueloViewSet)
router.register(r'v1/cultivo', CultivoViewSet)
router.register(r'v1/variedad-cultivo', VariedadCultivoViewSet)
router.register(r'v1/gasto', GastoViewSet)
router.register(r'v1/tipo-gasto', TipoGastoViewSet)
router.register(r'v1/recomendacion', RecomendacionViewSet)
router.register(r'v1/fertilizante', FertilizanteViewSet)
router.register(r'v1/historia-aplicacion', HistorialAplicacionViewSet)
router.register(r'v1/notificacion-erp', NotificacionERPViewSet)
router.register(r'v1/configuracion-notificacion', ConfiguracionNotificacionViewSet)
router.register(r'v1/question-answer', SectionQuestionAnswerViewSet)

urlpatterns = [
    path('api/', include((router.urls, 'api'), namespace='api_fertismart')),
    path('api/v1/dashboard/', DashboardAPIView.as_view(), name='dashboard')
]