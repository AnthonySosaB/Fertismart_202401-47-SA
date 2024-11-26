from decimal import Decimal
from django.http import HttpResponse
from rest_framework import status
from django.conf import settings
from django.db.models import Sum
from django.db.models.functions import ExtractMonth
from django.utils.timezone import now
from django.utils import timezone
import os
import pickle
import datetime
from enticen.models import ParameterDetail
from enticen.serializers import APIResponseSerializer
from fertismart.models import Campo, Fertilizante, Gasto, HistorialAplicacion, Recomendacion, TipoGasto
from fertismart.serializers import CampoSerializer, GastoSerializer, HistorialAplicacionSerializer, RecomendacionSerializer, TipoGastoSerializer
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.core.mail import EmailMessage

def listed_user_expense_report_gastos(request):
    try:
        usuario = request.user
        current_year = now().year
        current_month = now().month

        gastos_por_mes = Gasto.objects.filter(deleted_by=None, created_by_id=usuario, fecha_registro__year=current_year) \
            .annotate(month=ExtractMonth('fecha_registro')) \
            .values('month') \
            .annotate(total_gastos=Sum('monto')) \
            .order_by('month')

        total_gastos_anual = Gasto.objects.filter(deleted_by=None, created_by_id=usuario, fecha_registro__year=current_year) \
            .aggregate(total_gastos=Sum('monto'))['total_gastos'] or Decimal('0.00')

        total_gastos_mes_actual = Gasto.objects.filter(deleted_by=None, created_by_id=usuario, fecha_registro__year=current_year, fecha_registro__month=current_month) \
            .aggregate(total_gastos=Sum('monto'))['total_gastos'] or Decimal('0.00')

        data_gastos = [0] * 12
        data_ganancias = [0] * 12

        for gasto in gastos_por_mes:
            mes = gasto['month'] - 1 
            total_gastos = gasto['total_gastos'] or 0
            data_gastos[mes] = total_gastos
            data_ganancias[mes] = 0

        listado_gastos_usuario = Gasto.objects.filter(deleted_by=None, created_by_id=usuario)
        serializer_data_list = GastoSerializer(listado_gastos_usuario, many=True).data

        response_data = {
            "profitExpenseReport": {
                "series": [
                    {
                        "name": "Gastos",
                        "data": data_gastos
                    },
                    {
                        "name": "Ganancias",
                        "data": data_ganancias
                    }
                    
                ]
            },
            'budgetChart': {
                    'series': [
                        {
                            'data': [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62]
                        },
                        {
                            'data': [20, 10, 30, 15, 23, 0, 25, 15, 20, 5, 27]
                        }
                    ]
                },
            'totalsData': {
                'currentExpenseMonth': total_gastos_mes_actual,
                'currentExpenseYear': total_gastos_anual
            },
            "expensesList": serializer_data_list
        }
        return response_data, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en la generacion del reporte',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST


def listed_user_campos(request):
    try:
        usuario = request.user
        list_campo = Campo.objects.filter(deleted_by=None, created_by_id=usuario).order_by('-id')
        serializer_list_campo = CampoSerializer(list_campo, many=True).data
        return serializer_list_campo, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en el listado de campos',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST


def listed_user_tipos_gasto(request):
    try:
        usuario = request.user
        list_tipo_gasto = TipoGasto.objects.filter(deleted_by=None, created_by_id=usuario).order_by('-id')
        serializer_list_campo = TipoGastoSerializer(list_tipo_gasto, many=True).data

        return serializer_list_campo, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en el listado de tipos de gasto',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST


def listed_user_aplicaciones(request):
    try:
        usuario = request.user
        list_aplicacion = HistorialAplicacion.objects.filter(deleted_by=None, created_by_id=usuario).order_by('-id')
        serializer_list_aplicacion = HistorialAplicacionSerializer(list_aplicacion, many=True).data

        return serializer_list_aplicacion, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en el listado de aplicaciones',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST


def listed_user_recomendaciones(request):
    try:
        usuario = request.user
        list_recomendacion = Recomendacion.objects.filter(deleted_by=None, created_by_id=usuario).order_by('-id')
        serializer_list_recomendacion = RecomendacionSerializer(list_recomendacion, many=True).data

        return serializer_list_recomendacion, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en el listado de recomendaciones',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST
    

def generate_recommendation_predictive(request):
    try:
        campo_id = request.data.get('campo')
        campo = Campo.objects.get(id=campo_id)
        cultivo = campo.cultivo

        temperatura = request.data.get('temperatura')
        humedad_aire = request.data.get('humedad_aire')
        humedad_suelo = request.data.get('humedad_suelo')
        nitrogeno = request.data.get('nitrogeno')
        potasio = request.data.get('potasio')
        fosforo = request.data.get('fosforo')

        predict_path = os.path.join(settings.PREDICT_ROOT, 'classifier.pkl')
        with open(predict_path, 'rb') as model_file:
            model = pickle.load(model_file)
        
        ans = model.predict([[
            temperatura, 
            humedad_aire, 
            humedad_suelo, 
            campo.tipo_suelo.codigo_codificado, 
            campo.cultivo.codigo_codificado, 
            nitrogeno, 
            potasio, 
            fosforo]])

        fertilizante_id = ans[0]
        fertilizante = Fertilizante.objects.get(codigo_codificado=fertilizante_id)

        recomendacion = Recomendacion.objects.create(
            campo=campo,
            cultivo=cultivo,
            fertilizante=fertilizante,
            fecha=datetime.datetime.strptime(request.data.get('fecha'), "%d%m%Y"),
            fosforo=fosforo,
            potasio=potasio,
            temperatura=temperatura,
            humedad_suelo=humedad_suelo,
            humedad_aire=humedad_aire,
            nitrogeno=nitrogeno,
            estado_recomendacion="En proceso",
            observacion=request.data.get('observacion', ''),
            created_by=request.user,
            updated_by=request.user
        )
        serializer_recomendacion = RecomendacionSerializer(recomendacion).data

        return serializer_recomendacion, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en la generación de la recomendación',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST
    

def complete_recommendation(request):
    try:
        recomendacion = Recomendacion.objects.get(id=request.data.get('recomendacion'))
        
        aplicacion = HistorialAplicacion.objects.create(
            campo_id=recomendacion.campo.id,
            fertilizante_id=recomendacion.fertilizante.id,
            recomendacion=recomendacion,
            fecha_aplicacion=datetime.datetime.strptime(request.data.get('fecha_aplicacion'), "%d%m%Y"),
            dosis=request.data.get('dosis', ''),
            resultado=request.data.get('resultado', ''),
            created_by=request.user,
            updated_by=request.user
        )
        recomendacion.estado_recomendacion = 'Completada'
        recomendacion.save()

        serializer_aplicacion = HistorialAplicacionSerializer(aplicacion).data
    
        return serializer_aplicacion, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en completar la recomendación',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST


def reject_recommendation(request):
    try:
        recomendacion = Recomendacion.objects.get(id=request.data.get('recomendacion'))
        
        aplicacion = HistorialAplicacion.objects.create(
            campo_id=recomendacion.campo.id,
            fertilizante_id=recomendacion.fertilizante.id,
            recomendacion=recomendacion,
            fecha_aplicacion=datetime.datetime.strptime(request.data.get('fecha_aplicacion'), "%d%m%Y"),
            dosis=request.data.get('dosis', None),
            motivo_fallo=request.data.get('motivo_fallo', None),
            created_by=request.user,
            updated_by=request.user
        )
        recomendacion.estado_recomendacion = 'Rechazada'
        recomendacion.save()

        serializer_aplicacion = HistorialAplicacionSerializer(aplicacion).data
    
        return serializer_aplicacion, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en rechazar la recomendación',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST


def send_quote_pdf_by_email(request, recomendacion_id):
    try:
        recomendacion = Recomendacion.objects.get(id=recomendacion_id)
        buzon_ventas = ParameterDetail.objects.get(code='FS_COF_GEN_BCOT').string_value
        buzon_noreply = ParameterDetail.objects.get(code='FS_COF_GEN_BNRE').string_value
        
        template_path = 'solicitud_cotizacion.html'
        context = {'recomendacion': recomendacion}
        template = get_template(template_path)
        html = template.render(context)
        
        from io import BytesIO
        pdf = BytesIO()
        pisa_status = pisa.CreatePDF(html, dest=pdf)
        
        if pisa_status.err:
            return HttpResponse('Error al generar PDF', status=400)
        
        pdf.seek(0)
        
        email = EmailMessage(
            'Solicitud de Cotización',
            'Por favor, encuentre adjunto el archivo de la solicitud de cotización.',
            buzon_noreply,
            [buzon_ventas],
        )
        email.attach('solicitud_cotizacion.pdf', pdf.read(), 'application/pdf')
        email.send()

        return True, status.HTTP_200_OK
    except Exception as e:
        response_serializer = APIResponseSerializer(data=dict(
            success=False,
            message='Hubo un error en enviar la cotizacion',
            data={'error': {
                'message': str(e)
            }}
        ))
        response_serializer.is_valid()
        return response_serializer.data, status.HTTP_400_BAD_REQUEST