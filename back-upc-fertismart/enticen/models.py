from django.db import models
from django.conf import settings


class CreatedUpdatedDeleted(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="%(app_label)s_%(class)s_adder",
                                   on_delete=models.PROTECT, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True, editable=False)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="%(app_label)s_%(class)s_editor",
                                   on_delete=models.PROTECT, null=True, blank=True)
    updated_date = models.DateTimeField(editable=False, null=True, blank=True)
    deleted_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="%(app_label)s_%(class)s_deleter",
                                   on_delete=models.PROTECT, null=True, blank=True)
    deleted_date = models.DateTimeField(editable=False, null=True)

    def created_name(self):
        if self.created_by:
            return '%s %s' % (self.created_by.first_name, self.created_by.last_name)
        return None

    def updated_name(self):
        if self.updated_by:
            return '%s %s' % (self.updated_by.first_name, self.updated_by.last_name)
        return None

    def deleted_name(self):
        if self.deleted_by:
            return '%s %s' % (self.deleted_by.first_name, self.deleted_by.last_name)
        return None

    class Meta:
        abstract = True


class Parameter(models.Model):
    name = models.CharField(max_length=150, verbose_name="Name")
    code = models.CharField(max_length=20, verbose_name="Code", unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Parameter"
        verbose_name_plural = "Parameters"


class ParameterDetail(models.Model):
    parameter = models.ForeignKey(Parameter, on_delete=models.PROTECT, verbose_name="Parameter")
    name = models.CharField(max_length=150, verbose_name="Name")
    code = models.CharField(max_length=50, verbose_name="Code", null=True, blank=True, unique=True)
    numeric_value = models.IntegerField(verbose_name="Numeric value", null=True, blank=True)
    string_value = models.CharField(max_length=150, verbose_name="String value", null=True, blank=True)
    long_string_value = models.TextField(verbose_name="Long string value", null=True, blank=True)
    order = models.IntegerField(verbose_name="Order", null=True, blank=True)
    image = models.ImageField(upload_to='image/parameter', verbose_name="Image", null=True, blank=True)
    json_value = models.JSONField(verbose_name="JSON value", null=True, blank=True)
    file = models.FileField(upload_to='file/parameter', verbose_name="File", null=True, blank=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def get_name_parameter(self):
        if self.parameter:
            return self.parameter.name
        return None

    class Meta:
        verbose_name = "Parameter Detail"
        verbose_name_plural = "Parameters Detail"
        ordering = ["id"]


class Application(CreatedUpdatedDeleted):
    name = models.CharField(verbose_name="Name", max_length=50)
    short_name = models.CharField(verbose_name="Short Name", max_length=10)
    description = models.CharField(verbose_name="Description", max_length=250, null=True, blank=True)
    logo = models.ImageField(upload_to='image/logo', null=True, blank=True)

    def __str__(self):
        return f"{self.name} {self.short_name}"

    class Meta:
        verbose_name = "Application"
        verbose_name_plural = "Applications"
        ordering = ['-id']