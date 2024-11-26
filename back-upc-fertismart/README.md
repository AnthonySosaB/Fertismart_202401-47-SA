# fertismart

## crear y activar entorno virtual
```
 python3 -m venv env
 source env/bin/activate
```

## instalar dependencias
```
 pip install -r requirements.txt
```

## crear y ejecutar migraciones
```
 python manage.py makemigrations
 python manage.py migrate 
```

## crear superusuario
``` 
 python manage.py createsuperuser --email admin@fertismart.lat --username admin@fertismart.lat
```

## actualizar los paquetes

### /site-packages/jet/models.py
```
reemplazar
    from django.utils.encoding import python_2_unicode_compatible
con
    from six import python_2_unicode_compatible
```
### /site-packages/jet/dashboard/models.py
```
reemplazar
    from django.utils.encoding import python_2_unicode_compatible
con
    from six import python_2_unicode_compatible
```

### /site-packages/jet/dashboard/templates/admin/index.html
```
reemplazar
    {% load i18n admin_static jet_dashboard_tags static %}
con
    {% load i18n static jet_dashboard_tags static %}
```

### /site-packages/jet/static/jet/js/build/jquery.init.js
```
crear archivo y agregar
    var django = django || {};
    django.jQuery = jQuery.noConflict(true);
```

### /site-packages/jet/templates/admin/base.html
```
agregar
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
    <script src="{% static "jet/js/build/jquery.init.js" as url %}{{ url|jet_append_version }}"></script>
despues de
    {% block blockbots %}<meta name="robots" content="NONE,NOARCHIVE" />{% endblock %}
```

## ejecutar servidor
```
 python manage.py runserver localhost:8080
```

## key para encriptación y desencriptación de DB
```
 Solicitar al administrador o Jefe de Proyecto, la llave de desarrollo para el encriptado y desencriptado de la Data. 
```

