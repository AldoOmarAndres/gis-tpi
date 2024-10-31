# TPI para Sistemas de Información Geográficos

TPI realizado por el grupo 4 para la cursada 2024 de Sistemas de Información Geográficos, asignatura de Ingeniería en Sistemas de Información de la UTN FRRe.

## Guía de instalación

Esta guía supone que ya se tiene instalada la máquina virtual otorgada por la cátedra.

### 1. Crear BD

Para crear una base de datos PostgreSQL con la extensión PostGIS:

1. Abrir pgAdmin.
2. Crear una nueva base de datos de nombre `tpi_bd`.
3. Ejecutar el comando SQL `CREATE EXTENSION postgis`.

### Cargar capas a la BD

1. Descargar el archivo comprimido proporcionado por la cátedra con las capas del SIG IGN.
2. Descomprimir el archivo .zip descargado.
3. Estando posicionados en la carpeta donde se encuentran los archivos descomprimidos de las capas, ejecutar el script entero de `cargar-capas.sh` para cargar las capas a la base de datos.

### Cargar capas a QGIS

1. En el proyecto QGIS, ir a Data Source Manager > PostgreSQL.
2. Crear una nueva conexión de la BD creada.
3. Importar todos los esquemas de `public`.
4. Hacer click en Add.

### Configurar servidor de capas

Para configurar el servidor de QGIS hay que:

1. Ir a Project > Properties.
2. En Services Capabilities:
   - Habilitar Services Capabilities.
   - Los demas campos son opcionales, cargar a preferencia.
3. En WMS:
   - Habilitar Advertised extent.
   - Habilitar CRS y agregar: 'EPSG:4326' y 'EPSG:22175'.
   - Activar 2do y 3er checkbox.
4. En WMTS:
   - Publicar todas las capas.
   - Publicar los CRS.
5. En WFS:
   - Publicar todo.
6. Hacer click en Apply y Ok.

Guardar ahora el archivo como `TPI.qgs` y ejecutar el siguiente comando:

```
sudo mv /home/user/TPI.qgs /var/www/html/
```

El servidor debería responder en http://localhost/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&map=/var/www/html/TPI.qgs
