from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources

from .models import *


class CampoResource(resources.ModelResource):
    class Meta:
        model = Campo
        fields = ['id', 'cultivo', 'nombre_campo', 'siglas_campo', 'variedad', 'area', 'latitud', 'longitud', 'estado']


class TipoSueloResource(resources.ModelResource):
    class Meta:
        model = TipoSuelo
        fields = ['id', 'nombre_tipo_suelo', 'siglas_tipo_suelo', 'codigo_codificado']

class CultivoResource(resources.ModelResource):
    class Meta:
        model = Cultivo
        fields = ['id', 'nombre_cultivo', 'siglas_cultivo', 'requerimiento_suelo', 'estado', 
                  'variedad', 'codigo_codificado']

class VariedadCultivoResource(resources.ModelResource):
    class Meta:
        model = VariedadCultivo
        fields = ['id', 'nombre_variedad', 'siglas_variedad']

class GastoResource(resources.ModelResource):
    class Meta:
        model = Gasto
        fields = ['id', 'campo', 'descripcion_gasto', 'tipo_gasto', 'fecha_registro', 'monto', 
                  'observaciones']

class TipoGastoResource(resources.ModelResource):
    class Meta:
        model = TipoGasto
        fields = ['id', 'nombre_tipo_gasto', 'siglas_tipo_gasto']

class RecomendacionResource(resources.ModelResource):
    class Meta:
        model = Recomendacion
        fields = ['id', 'campo', 'fertilizante', 'cultivo', 'fecha', 'fosforo', 'potasio', 'temperatura', 
                  'humedad_suelo', 'humedad_aire', 'nitrogeno', 'estado_recomendacion', 'observacion',
                  'get_nombre_campo', 'get_nombre_fertilizante', 'get_nombre_cultivo']

class FertilizanteResource(resources.ModelResource):
    class Meta:
        model = Fertilizante
        fields = ['id', 'nombre_fertilizante', 'composicion', 'precio', 'codigo_codificado']

class HistorialAplicacionResource(resources.ModelResource):
    class Meta:
        model = HistorialAplicacion
        fields = ['id', 'campo', 'fertilizante', 'recomendacion', 'fecha_aplicacion', 'dosis', 
                  'resultado', 'motivo_fallo']

class NotificacionERPResource(resources.ModelResource):
    class Meta:
        model = NotificacionERP
        fields = [field.name for field in NotificacionERP._meta.get_fields()]

class ConfiguracionNotificacionResource(resources.ModelResource):
    class Meta:
        model = ConfiguracionNotificacion
        fields = ['id', 'tipo_notificacion', 'frecuencia_notificacion', 'destinatario', 'estado']


class SectionQuestionAnswerResource(resources.ModelResource):
    class Meta:
        model = SectionQuestionAnswer
        fields = ['id', 'name', 'icon', 'title', 'subtitle']


class QuestionAnswerResource(resources.ModelResource):
    class Meta:
        model = QuestionAnswer
        fields = ['id', 'section', 'question', 'ans']
#####################################################
class CampoAdmin(ImportExportModelAdmin):
    resource_class = CampoResource
    list_display = ['id', 'cultivo', 'nombre_campo', 'siglas_campo', 'variedad', 'area', 'latitud', 'longitud', 'estado']

class TipoSueloAdmin(ImportExportModelAdmin):
    resource_class = TipoSueloResource
    list_display = ['id', 'nombre_tipo_suelo', 'siglas_tipo_suelo', 'codigo_codificado']

class CultivoAdmin(ImportExportModelAdmin):
    resource_class = CultivoResource
    list_display = ['id', 'nombre_cultivo', 'siglas_cultivo', 'requerimiento_suelo', 'estado', 
                  'variedad', 'codigo_codificado']

class VariedadCultivoAdmin(ImportExportModelAdmin):
    resource_class = VariedadCultivoResource
    list_display = ['id', 'nombre_variedad', 'siglas_variedad']

class GastoAdmin(ImportExportModelAdmin):
    resource_class = GastoResource
    list_display = ['id', 'campo', 'descripcion_gasto', 'tipo_gasto', 'fecha_registro', 'monto', 
                    'observaciones', 'get_nombre_tipo_gasto']

class TipoGastoAdmin(ImportExportModelAdmin):
    resource_class = TipoGastoResource
    list_display = ['id', 'nombre_tipo_gasto', 'siglas_tipo_gasto']

class RecomendacionAdmin(ImportExportModelAdmin):
    resource_class = RecomendacionResource
    list_display = ['id', 'campo', 'fertilizante', 'cultivo', 'fecha', 'fosforo', 'potasio', 'temperatura', 
                  'humedad_suelo', 'humedad_aire', 'nitrogeno', 'estado_recomendacion', 'observacion',
                  'get_nombre_campo', 'get_nombre_fertilizante', 'get_nombre_cultivo']

class FertilizanteAdmin(ImportExportModelAdmin):
    resource_class = FertilizanteResource
    list_display = ['id', 'nombre_fertilizante', 'composicion', 'precio', 'codigo_codificado']

class HistorialAplicacionAdmin(ImportExportModelAdmin):
    resource_class = HistorialAplicacionResource
    list_display = ['id', 'campo', 'fertilizante', 'recomendacion', 'fecha_aplicacion', 'dosis', 
                    'resultado', 'motivo_fallo']

class NotificacionERPAdmin(ImportExportModelAdmin):
    resource_class = NotificacionERPResource
    list_display = [field.name for field in NotificacionERP._meta.get_fields()]

class ConfiguracionNotificacionAdmin(ImportExportModelAdmin):
    resource_class = ConfiguracionNotificacionResource
    list_display = ['id', 'tipo_notificacion', 'frecuencia_notificacion', 'destinatario', 'estado']


class SectionQuestionAnswerAdmin(ImportExportModelAdmin):
    resource_class = SectionQuestionAnswerResource
    list_display = ['id', 'name', 'icon', 'title', 'subtitle']


class QuestionAnswerAdmin(ImportExportModelAdmin):
    resource_class = QuestionAnswerResource
    list_display = ['id', 'section', 'question', 'ans']

admin.site.register(Campo, CampoAdmin)
admin.site.register(TipoSuelo, TipoSueloAdmin)
admin.site.register(Cultivo, CultivoAdmin)
admin.site.register(VariedadCultivo, VariedadCultivoAdmin)
admin.site.register(Gasto, GastoAdmin)
admin.site.register(TipoGasto, TipoGastoAdmin)
admin.site.register(Recomendacion, RecomendacionAdmin)
admin.site.register(Fertilizante, FertilizanteAdmin)
admin.site.register(HistorialAplicacion, HistorialAplicacionAdmin)
admin.site.register(NotificacionERP, NotificacionERPAdmin)
admin.site.register(ConfiguracionNotificacion, ConfiguracionNotificacionAdmin)
admin.site.register(SectionQuestionAnswer, SectionQuestionAnswerAdmin)
admin.site.register(QuestionAnswer, QuestionAnswerAdmin)

admin.site.site_header = "FertiSmart - Admin Site"
admin.site.site_title = "FertiSmart  - Admin Site"
