# Guía de instalación
La guía parte del supuesto que ya se tiene instalada la máquina virtual propuesta por la catedra.

## Crear BD
Se tiene que crear una BD para el proyecto, para esto hacer lo siguiente:
1. Abrir pgAdmin
2. Crear una nueva base de datos (en este caso se la nombro ´´´tpi_bd´´´ )
3. Ejecutar el comando: ´´´CREATE EXTENSION postgis´´´


## Cargar capas a BD
Descargamos las capas proporcionadas por la catedra, y descomprimimos el archivo, dejandolo en "Downloads" o donde se prefiera

Para cargar las capas, ejecutamos los comandos que se encuentran en el archivo ´´´carga-capas.txt´´´ en la terminal. 
(Tenemos que estar posicionados en donde se encuentran las capas descomprimidas)


## Cargar capas a QGIS
1. Ir a Data Source Manager > PostgreSQL
2. Crear una nueva conexión de la BD creada
3. Importar todos los esquemas de public
4. Hacer click en "Add"


## Configurar Servidor
Para configurar el servidor de qgis hay que:
1. Ir a Project > Properties
2. Services Capabilities
    . Habilitar Services Capabilities
    . Los demas campos son opcionales, cargar a preferencia
3. WMS
    . Habilitar Advertised extent
    . Habilitar CRS y agregar: 'EPSG:4326' y 'EPSG:22175'
    . Activar 2do y 3er checkbox
4. WMTS
    . Publicar todas las capas
    . Publicar los CRS
5. WFS
    . Publicar todo
6. Hacer click en "Aplly" y "OK"


Guardar ahora el archivo como TPI.qgs

Ejecutar el comando: "sudo mv /home/user/TPI.qgs /var/www/html/" -> suponiendo que el archivo está en esa dirección, editar según sea necesario.

Probar que el servidor está corriendo buscando en el navegador: "http://localhost/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&map=/var/www/html/TPI.qgs"
