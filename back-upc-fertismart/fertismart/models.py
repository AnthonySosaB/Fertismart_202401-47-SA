from django.db import models
from enticen.models import CreatedUpdatedDeleted, ParameterDetail


class Campo(CreatedUpdatedDeleted):
    cultivo = models.ForeignKey('Cultivo', on_delete=models.PROTECT, related_name='cultivo_campo')
    tipo_suelo = models.ForeignKey('TipoSuelo', on_delete=models.PROTECT, related_name='tipo_suelo_campo', null=True, blank=True)
    nombre_campo = models.CharField(max_length=80)
    siglas_campo = models.CharField(max_length=20, null=True, blank=True)
    variedad = models.ForeignKey('VariedadCultivo', on_delete=models.SET_NULL, null=True, blank=True, related_name='variedad_campo')
    area = models.IntegerField(null=True, blank=True)
    latitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    estado = models.BooleanField(null=True, blank=True, default=False)

    def __str__(self):
        return f"{self.nombre_campo}"
    
    def get_nombre_cultivo(self):
        if self.cultivo:
            return self.cultivo.nombre_cultivo
        return None
    
    def get_nombre_variedad(self):
        if self.variedad:
            return self.variedad.nombre_variedad
        return None
    
    def get_nombre_tipo_suelo(self):
        if self.tipo_suelo:
            return self.tipo_suelo.nombre_tipo_suelo
        return None

    class Meta:
        verbose_name = "Campo"
        verbose_name_plural = "Campos"
        ordering = ['id']


class TipoSuelo(CreatedUpdatedDeleted):
    nombre_tipo_suelo = models.CharField(max_length=80)
    siglas_tipo_suelo = models.CharField(max_length=20, null=True, blank=True)
    codigo_codificado = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_tipo_suelo}"

    class Meta:
        verbose_name = "Tipo Suelo"
        verbose_name_plural = "Tipos Suelo"
        ordering = ['id']


class Cultivo(CreatedUpdatedDeleted):
    nombre_cultivo = models.CharField(max_length=80)
    siglas_cultivo = models.CharField(max_length=20)
    requerimiento_suelo = models.CharField(max_length=255, null=True, blank=True)
    estado = models.BooleanField(null=True, blank=True, default=False)
    variedad = models.ForeignKey('VariedadCultivo', on_delete=models.PROTECT, related_name='variedad_cultivo', null=True, blank=True)
    codigo_codificado = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_cultivo}"
    
    def get_nombre_variedad(self):
        if self.variedad:
            return self.variedad.nombre_variedad
        return None

    class Meta:
        verbose_name = "Cultivos"
        verbose_name_plural = "Cultivo"
        ordering = ['id']


class VariedadCultivo(CreatedUpdatedDeleted):
    nombre_variedad = models.CharField(max_length=80, null=True, blank=True)
    siglas_variedad = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_variedad}"
    
    class Meta:
        verbose_name = "Variedad Cultivo"
        verbose_name_plural = "Variedades Cultivo"
        ordering = ['id']


class Gasto(CreatedUpdatedDeleted):
    campo = models.ForeignKey('Campo', on_delete=models.PROTECT, related_name='campo_gasto')
    descripcion_gasto = models.CharField(max_length=80)
    tipo_gasto = models.ForeignKey('TipoGasto', on_delete=models.PROTECT, related_name='tipo_gasto_gasto')
    fecha_registro = models.DateTimeField(null=True, blank=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    observaciones = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.descripcion_gasto}"
    
    def get_nombre_tipo_gasto(self):
        if self.tipo_gasto:
            return self.tipo_gasto.nombre_tipo_gasto
        return None
    
    def get_nombre_campo(self):
        if self.campo:
            return self.campo.nombre_campo
        return None
    
    class Meta:
        verbose_name = "Gasto"
        verbose_name_plural = "Gastos"
        ordering = ['id']


class TipoGasto(CreatedUpdatedDeleted):
    nombre_tipo_gasto = models.CharField(max_length=80)
    siglas_tipo_gasto = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.nombre_tipo_gasto}"

    class Meta:
        verbose_name = "Tipo Gasto"
        verbose_name_plural = "Tipos Gasto"
        ordering = ['id']


class Recomendacion(CreatedUpdatedDeleted):
    campo = models.ForeignKey('Campo', on_delete=models.PROTECT, related_name='campo_recomendacion')
    fertilizante = models.ForeignKey('Fertilizante', on_delete=models.PROTECT, related_name='fertilizante_recomendacion')
    cultivo = models.ForeignKey('Cultivo', on_delete=models.PROTECT, related_name='cultivo_recomendacion', null=True, blank=True)
    fecha = models.DateTimeField(null=True, blank=True)
    fosforo = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    potasio = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    temperatura = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    humedad_suelo = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    humedad_aire = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    nitrogeno = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estado_recomendacion = models.CharField(max_length=20, null=True, blank=True)
    observacion = models.CharField(max_length=80, null=True, blank=True)

    def __str__(self):
        return f"{self.id}"
    
    def get_nombre_campo(self):
        if self.campo:
            return self.campo.nombre_campo
        return None
    
    def get_nombre_fertilizante(self):
        if self.fertilizante:
            return self.fertilizante.nombre_fertilizante
        return None
    
    def get_nombre_cultivo(self):
        if self.cultivo:
            return self.cultivo.nombre_cultivo
        return None
    
    class Meta:
        verbose_name = "Recomendacion"
        verbose_name_plural = "Recomendaciones"
        ordering = ['id']


class Fertilizante(CreatedUpdatedDeleted):
    nombre_fertilizante = models.CharField(max_length=80)
    composicion = models.CharField(max_length=200, null=True, blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    codigo_codificado = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_fertilizante}"
    
    class Meta:
        verbose_name = "Fertilizante"
        verbose_name_plural = "Fertilizantes"
        ordering = ['id']


class HistorialAplicacion(CreatedUpdatedDeleted):
    campo = models.ForeignKey('Campo', on_delete=models.PROTECT, related_name='campo_historial_apli')
    fertilizante = models.ForeignKey('Fertilizante', on_delete=models.PROTECT, related_name='fertilizante_historial_apli')
    recomendacion = models.ForeignKey('Recomendacion', on_delete=models.SET_NULL, null=True, blank=True, related_name='recomendacion_historial_apli')
    fecha_aplicacion = models.DateTimeField(null=True, blank=True)
    dosis = models.CharField(max_length=120, null=True, blank=True)
    resultado = models.CharField(max_length=120, null=True, blank=True)
    motivo_fallo = models.CharField(max_length=120, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_fertilizante}"
    
    def get_nombre_campo(self):
        if self.campo:
            return self.campo.nombre_campo
        return None
    
    def get_nombre_fertilizante(self):
        if self.fertilizante:
            return self.fertilizante.nombre_fertilizante
        return None
    
    def get_recomendacion_observacion(self):
        if self.recomendacion:
            return self.recomendacion.observacion
        return None
    
    def get_recomendacion_estado(self):
        if self.recomendacion:
            return self.recomendacion.estado_recomendacion
        return None
    
    class Meta:
        verbose_name = "Historial Aplicacion"
        verbose_name_plural = "Historial Aplicaciones"
        ordering = ['id']


class NotificacionERP(CreatedUpdatedDeleted):
    recomendacion = models.ForeignKey('Recomendacion', on_delete=models.PROTECT, null=True, blank=True, related_name='recomendacion_notif_erp')
    estado_notificacion = models.CharField(max_length=20, null=True, blank=True)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    respuesta_erp = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        verbose_name = "Notificacion ERP"
        verbose_name_plural = "Notificaciones ERP"
        ordering = ['id']


class ConfiguracionNotificacion(CreatedUpdatedDeleted):
    tipo_notificacion = models.ForeignKey(ParameterDetail, on_delete=models.PROTECT, related_name='configuraciones_tipo', null=True, blank=True)
    frecuencia_notificacion = models.ForeignKey(ParameterDetail, on_delete=models.PROTECT, related_name='configuraciones_frecuencia', null=True, blank=True)
    destinatario = models.CharField(max_length=255, null=True, blank=True)
    estado = models.BooleanField(null=True, blank=True, default=False)

    def __str__(self):
        return f"{self.tipo_notificacion}"
    
    def get_tipo_notificacion_name(self):
        if self.tipo_notificacion:
            return self.tipo_notificacion.name
        return None
    
    def get_tipo_notificacion_name(self):
        if self.frecuencia_notificacion:
            return self.frecuencia_notificacion.name
        return None
    
    class Meta:
        verbose_name = "Configuracion Notificacion"
        verbose_name_plural = "Configuracion Notificaciones"
        ordering = ['id']


class SectionQuestionAnswer(CreatedUpdatedDeleted):
    name = models.CharField(max_length=100, null=True, blank=True)
    icon = models.CharField(max_length=100, null=True, blank=True)
    title = models.CharField(max_length=100, null=True, blank=True)
    subtitle = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name


class QuestionAnswer(CreatedUpdatedDeleted):
    section = models.ForeignKey(SectionQuestionAnswer, related_name='qandA', on_delete=models.CASCADE)
    question = models.CharField(max_length=255, null=True, blank=True)
    ans = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.question