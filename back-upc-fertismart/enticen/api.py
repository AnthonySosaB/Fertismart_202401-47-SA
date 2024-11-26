import datetime

from django.core import serializers
from django.db.models import ProtectedError

from rest_condition import Or as rest_Or
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from config_permission.permissions.soporte_permissions import SoporteReadEditPermissions
from config_permission.permissions.superuser_permissions import SuperuserReadEditPermissions
from enticen.models import Parameter, ParameterDetail, Application
from enticen.serializers import APIResponseSerializer, ParameterSerializer, ParameterDetailSerializer, \
    ApplicationSerializer


class AuditModelViewSet(viewsets.ModelViewSet):
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user,
                        updated_by=self.request.user,
                        updated_date=datetime.datetime.now())

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user,
                        updated_date=datetime.datetime.now())

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_date = datetime.datetime.now()
        instance.deleted_by = self.request.user
        instance.save()

        fields = [field.name for field in instance._meta.get_fields()]
        data = serializers.serialize('python', [instance], fields=fields)[0]

        response_serializer = APIResponseSerializer(data=dict(
            success=True,
            message='Eliminado correctamente',
            data=data['fields'],
        ))
        response_serializer.is_valid()
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class ParameterViewSet(viewsets.ModelViewSet):
    queryset = Parameter.objects.all().order_by('-id')
    serializer_class = ParameterSerializer
    permission_classes = (rest_Or(SuperuserReadEditPermissions, SoporteReadEditPermissions),)


class ParameterDetailViewSet(viewsets.ModelViewSet):
    queryset = ParameterDetail.objects.all().order_by('-id')
    serializer_class = ParameterDetailSerializer
    permission_classes = (rest_Or(SuperuserReadEditPermissions, SoporteReadEditPermissions),)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()

            fields = [field.name for field in instance._meta.get_fields()]
            data = serializers.serialize('python', [instance], fields=fields)[0]

            response_serializer = APIResponseSerializer(data=dict(
                success=True,
                message='Eliminado correctamente',
                data=data['fields'],
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except ProtectedError as e:
            a, b = e.args
            msg_exception = 'No se puede eliminar el Parámetro Detalle porque se encuentra vinculado a las otras ' \
                            'entidades '
            entities = str(b)
            data = {
                'type': str(type(e)),
                'entities': entities
            }

            response_serializer = APIResponseSerializer(data=dict(
                success=False,
                message=msg_exception,
                data=data,
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def detail_list(self, request):
        try:
            parameter = request.data['parameter']
        except Exception as e:
            return Response({
                'status': 400,
                'example_parameters': {
                    "parameter": 99
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            params_det = ParameterDetail.objects.filter(parameter_id=parameter).order_by('id')
            serializer_data = self.get_serializer(params_det, many=True).data

            response_serializer = APIResponseSerializer(data=dict(
                success=True,
                message='Se obtuvo los sub parámetros',
                data=serializer_data,
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            response_serializer = APIResponseSerializer(data=dict(
                success=False,
                message='Error al obtener sub parámetros',
                data=str(e),
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_400_BAD_REQUEST)


class ApplicationViewSet(AuditModelViewSet):
    queryset = Application.objects.filter(deleted_by=None)
    serializer_class = ApplicationSerializer


class ManyParameters(APIView):
    permission_classes = (rest_Or(IsAuthenticated),)

    def post(self, request, *args, **kwargs):
        try:
            parameter_list = request.data['parameters']
        except Exception as e:
            return Response({
                'status': 400,
                'example_parameters': {
                    "parameters": []
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = []
            if parameter_list:
                item_elements = {}
                for item in parameter_list:
                    parameters_elements = ParameterDetail.objects.filter(
                        parameter__code=item, active=True)
                    serializer = ParameterDetailSerializer(
                        parameters_elements, many=True)
                    item_elements[item] = serializer.data
                result.append(item_elements)

            response_serializer = APIResponseSerializer(data=dict(
                success=True,
                message='Se obtuvo los parámetros multiples',
                data=result,
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            response_serializer = APIResponseSerializer(data=dict(
                success=False,
                message='Error al obtener parámetros multiples',
                data=[],
            ))
            response_serializer.is_valid()
            return Response(response_serializer.data, status=status.HTTP_400_BAD_REQUEST)
