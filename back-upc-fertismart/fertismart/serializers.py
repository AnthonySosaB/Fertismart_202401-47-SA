from .models import *
from rest_framework import serializers


class CampoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campo
        fields = ['id', 'cultivo', 'tipo_suelo', 'nombre_campo', 'siglas_campo', 'variedad', 'area', 'latitud', 
                  'longitud', 'estado', 'get_nombre_cultivo', 'get_nombre_variedad', 'get_nombre_tipo_suelo']


class TipoSueloSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoSuelo
        fields = ['id', 'nombre_tipo_suelo', 'siglas_tipo_suelo', 'codigo_codificado']
        

class CultivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cultivo
        fields = ['id', 'nombre_cultivo', 'siglas_cultivo', 'requerimiento_suelo', 'estado', 'variedad', 
                  'get_nombre_variedad', 'codigo_codificado']


class VariedadCultivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariedadCultivo
        fields = ['id', 'nombre_variedad', 'siglas_variedad']


class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = ['id', 'campo', 'descripcion_gasto', 'tipo_gasto', 'fecha_registro', 'monto', 
                  'observaciones', 'get_nombre_tipo_gasto', 'get_nombre_campo']


class TipoGastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoGasto
        fields = ['id', 'nombre_tipo_gasto', 'siglas_tipo_gasto']


class RecomendacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recomendacion
        fields = ['id', 'campo', 'fertilizante', 'cultivo', 'fecha', 'fosforo', 'potasio', 'temperatura', 
                  'humedad_suelo', 'humedad_aire', 'nitrogeno', 'estado_recomendacion', 'observacion',
                  'get_nombre_campo', 'get_nombre_fertilizante', 'get_nombre_cultivo']


class FertilizanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fertilizante
        fields = ['id', 'nombre_fertilizante', 'composicion', 'precio', 'codigo_codificado']


class HistorialAplicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialAplicacion
        fields = ['id', 'campo', 'fertilizante', 'recomendacion', 'fecha_aplicacion', 'dosis', 
                'resultado', 'motivo_fallo', 'get_nombre_campo', 'get_nombre_fertilizante',
                'get_recomendacion_observacion', 'get_recomendacion_estado']


class NotificacionERPSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificacionERP
        fields = '__all__'


class ConfiguracionNotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionNotificacion
        fields = ['id', 'tipo_notificacion', 'frecuencia_notificacion', 'destinatario', 'estado']


class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = ['id', 'section', 'question', 'ans']


class SectionQuestionAnswerSerializer(serializers.ModelSerializer):
    qandA = QuestionAnswerSerializer(many=True)

    class Meta:
        model = SectionQuestionAnswer
        fields = ['id', 'name', 'icon', 'title', 'subtitle', 'qandA']