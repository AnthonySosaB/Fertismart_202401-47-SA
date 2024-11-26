import csv
from django.db import transaction

from django.http import HttpResponse
from rest_condition import Or as rest_Or
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from config_permission.permissions.agricultor_permissions import AgricultorReadEditPermissions, AgricultorReadPermissions
from config_permission.permissions.soporte_permissions import SoporteReadEditPermissions
from config_permission.permissions.superuser_permissions import SuperuserReadEditPermissions
from enticen.api import AuditModelViewSet
from enticen.serializers import APIResponseSerializer
from enticen.utils import process_response_failed, process_response_success
from fertismart.models import *
from fertismart.serializers import *
from fertismart.views import complete_recommendation, generate_recommendation_predictive, listed_user_aplicaciones, listed_user_campos, listed_user_expense_report_gastos, listed_user_recomendaciones, listed_user_tipos_gasto, reject_recommendation, send_quote_pdf_by_email


class CampoViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = Campo.objects.filter(deleted_by=None)
    serializer_class = CampoSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        listed, status = listed_user_campos(request)
        return Response(listed, status=status)


class TipoSueloViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = TipoSuelo.objects.filter(deleted_by=None)
    serializer_class = TipoSueloSerializer


class CultivoViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = Cultivo.objects.filter(deleted_by=None)
    serializer_class = CultivoSerializer


class VariedadCultivoViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = VariedadCultivo.objects.filter(deleted_by=None)
    serializer_class = VariedadCultivoSerializer


class GastoViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = Gasto.objects.filter(deleted_by=None)
    serializer_class = GastoSerializer

    @action(detail=False, methods=['get'])
    def search_report(self, request):
        report, status = listed_user_expense_report_gastos(request)
        return Response(report, status=status)


class TipoGastoViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = TipoGasto.objects.filter(deleted_by=None)
    serializer_class = TipoGastoSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        listed, status = listed_user_tipos_gasto(request)
        return Response(listed, status=status)


class RecomendacionViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = Recomendacion.objects.filter(deleted_by=None)
    serializer_class = RecomendacionSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        listed, status = listed_user_recomendaciones(request)
        return Response(listed, status=status)
    
    @action(detail=False, methods=['post'])
    @transaction.atomic
    def generate(self, request):
        try:
            campo = request.data['campo']
            fecha = request.data['fecha']
            fosforo = request.data['fosforo']
            potasio = request.data['potasio']
            temperatura = request.data['temperatura']
            humedad_suelo = request.data['humedad_suelo']
            humedad_aire = request.data['humedad_aire']
            nitrogeno = request.data['nitrogeno']
        except Exception as e:
            response_serializer = APIResponseSerializer(data=dict(
                success=False,
                message='No se han enviado los parámetros correctos para generar la recomendación',
                data={'example_parameters': {
                    'campo': 99,
                    'fecha': 99,
                    'fosforo': 99,
                    'potasio': 99,
                    'temperatura': 99,
                    'humedad_suelo': 99,
                    'humedad_aire': 99,
                    'nitrogeno': 99,
                }}
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
        generate, status = generate_recommendation_predictive(request)
        return Response(generate, status=status)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def completed(self, request):
        try:
            recomendacion = request.data['recomendacion']
            fecha_aplicacion = request.data['fecha_aplicacion']
            dosis = request.data['dosis']
            resultado = request.data['resultado']
        except Exception as e:
            response_serializer = APIResponseSerializer(data=dict(
                success=False,
                message='No se han enviado los parámetros correctos',
                data={'example_parameters': {
                    'recomendacion': 99,
                    'fecha_aplicacion': '12122024',
                    'dosis': 'Dosis',
                    'resultado': 'Resultado'
                }}
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
        completed, status = complete_recommendation(request)
        return Response(completed, status=status)
    

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def rejected(self, request):
        try:
            recomendacion = request.data['recomendacion']
            fecha_aplicacion = request.data['fecha_aplicacion']
            dosis = request.data['dosis']
            motivo_fallo = request.data['motivo_fallo']
        except Exception as e:
            response_serializer = APIResponseSerializer(data=dict(
                success=False,
                message='No se han enviado los parámetros correctos',
                data={'example_parameters': {
                    'recomendacion': 99,
                    'fecha_aplicacion': '12122024',
                    'dosis': 'Dosis',
                    'resultado': 'Resultado'
                }}
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
        rejected, status = reject_recommendation(request)
        return Response(rejected, status=status)


    @action(detail=False, methods=['post'])
    @transaction.atomic
    def send_quote(self, request):
        try:
            recomendacion = request.data['recomendacion']
        except Exception as e:
            response_serializer = APIResponseSerializer(data=dict(
                success=False,
                message='No se han enviado los parámetros correctos',
                data={'example_parameters': {
                    'recomendacion': 99
                }}
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
        sending, status = send_quote_pdf_by_email(request, request.data['recomendacion'])
        return Response(sending, status=status)

class FertilizanteViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadPermissions, SoporteReadEditPermissions),)
    queryset = Fertilizante.objects.filter(deleted_by=None)
    serializer_class = FertilizanteSerializer


class HistorialAplicacionViewSet(AuditModelViewSet):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadEditPermissions, SoporteReadEditPermissions),)
    queryset = HistorialAplicacion.objects.filter(deleted_by=None)
    serializer_class = HistorialAplicacionSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        listed, status = listed_user_aplicaciones(request)
        return Response(listed, status=status)

    @action(detail=False, methods=['get'])
    def generate_report(self, request):
        usuario = request.user
        list_recomendacion = Recomendacion.objects.filter(deleted_by=None, created_by_id=usuario, estado_recomendacion='Completada').order_by('-id')
        data_list_recomendacion = RecomendacionSerializer(list_recomendacion, many=True).data

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="crop_fertilizers.csv"'

        writer = csv.writer(response)
        writer.writerow(['Temparature', 'Humidity', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous', 'Fertilizer Name'])
        for data in data_list_recomendacion:
            print(data)
            writer.writerow([
                data['temperatura'], 
                data['humedad_aire'],
                data['humedad_suelo'],
                data['get_nombre_campo'],
                data['get_nombre_cultivo'],
                data['nitrogeno'],
                data['potasio'],
                data['fosforo'],
                data['get_nombre_fertilizante']
            ])

        return response


class NotificacionERPViewSet(AuditModelViewSet):
    queryset = NotificacionERP.objects.filter(deleted_by=None)
    serializer_class = NotificacionERPSerializer


class ConfiguracionNotificacionViewSet(AuditModelViewSet):
    queryset = ConfiguracionNotificacion.objects.filter(deleted_by=None)
    serializer_class = ConfiguracionNotificacionSerializer


class SectionQuestionAnswerViewSet(AuditModelViewSet):
    queryset = SectionQuestionAnswer.objects.filter(deleted_by=None)
    serializer_class = SectionQuestionAnswerSerializer
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadPermissions, SoporteReadEditPermissions),)

    @action(detail=False, methods=['get'])
    def search(self, request):
        sections = SectionQuestionAnswer.objects.all()
        serialized_data = {}

        for section in sections:
            serialized_section = SectionQuestionAnswerSerializer(section).data
            serialized_data[section.name] = serialized_section

        return Response(serialized_data)


class DashboardAPIView(APIView):
    permission_classes = (rest_Or(SuperuserReadEditPermissions, AgricultorReadPermissions, SoporteReadEditPermissions),)
    def get(self, request):
        usuario = request.user
        total = Recomendacion.objects.filter(deleted_by=None, created_by_id=usuario).count()
        if total == 0:
            data = {
                "total_predicciones": {
                    "completadas": 0,
                    "rechazadas": 0,
                    "series": [0, 0],
                    "labels": ["Acertadas", "Rechazadas"]
                }
            }
        else:
            completadas = Recomendacion.objects.filter(deleted_by=None, created_by_id=usuario, estado_recomendacion='Completada').count()
            rechazadas = Recomendacion.objects.filter(deleted_by=None, created_by_id=usuario, estado_recomendacion='Rechazada').count()
            completadas_pct = round((completadas / total) * 100, 2)
            rechazadas_pct = round((rechazadas / total) * 100, 2)

            data = {
                "total_predicciones": {
                    "completadas": completadas,
                    "rechazadas": rechazadas,
                    "series": [completadas_pct, rechazadas_pct],
                    "labels": ["Acertadas", "Rechazadas"]
                }
            }
        return Response(data, status=status.HTTP_200_OK)