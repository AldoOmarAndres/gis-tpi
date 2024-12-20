# Ejecutar `find | grep -E "*.shp$"` en la carpeta de las capas del IGN obtiene todos los nombres de los archivos `.shp`.
# Cada línea es un comando que carga el archivo `.shp` a la base de datos PostgreSQL con la extensión PostGIS habilitada.
shp2pgsql -c -I -s 4326 Actividades_Agropecuarias.shp actividades_agropecuarias | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Actividades_Economicas.shp actividades_economicas | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Complejo_de_Energia_Ene.shp complejo_de_energia_ene | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Curso_de_Agua_Hid.shp curso_de_agua_hid | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Curvas_de_Nivel.shp curvas_de_nivel | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edif_Construcciones_Turisticas.shp edif_construcciones_turisticas | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edif_Depor_y_Esparcimiento.shp edif_depor_y_esparcimiento | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edif_Educacion.shp edif_educacion | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edif_Religiosos.shp edif_religiosos | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edificio_de_Seguridad_IPS.shp edificio_de_seguridad_ips | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edificio_Publico_IPS.shp edificio_publico_ips | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edificios_Ferroviarios.shp edificios_ferroviarios | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Edificio_de_Salud_IPS.shp edificio_de_salud_ips | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Ejido.shp ejido | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Espejo_de_Agua_Hid.shp espejo_de_agua_hid | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Estructuras_portuarias.shp estructuras_portuarias | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Infraestructura_Aeroportuaria_Punto.shp infraestructura_aeroportuaria_punto | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Infraestructura_Hidro.shp infraestructura_hidro | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Isla.shp isla | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Limite_Politico_Administrativo_Lim.shp limite_politico_administrativo_lim | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Líneas_de_Conducción_Ene.shp lineas_de_conduccion_ene | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Localidades.shp localidades | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Marcas_y_Señales.shp marcas_y_seniales | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Muro_Embalse.shp muro_embalse | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Obra_de_Comunicación.shp obra_de_comunicacion | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Obra_Portuaria.shp obra_portuaria | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Otras_Edificaciones.shp otras_edificaciones | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Provincias.shp provincias | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Pais_Lim.shp pais_lim | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Puente_Red_Vial_Puntos.shp puente_red_vial_puntos | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Puntos_de_Alturas_Topograficas.shp puntos_de_alturas_topograficas | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Puntos_del_Terreno.shp puntos_del_terreno | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Red_ferroviaria.shp red_ferroviaria | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Red_Vial.shp red_vial | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Salvado_de_Obstaculo.shp salvado_de_obstaculo | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Señalizaciones.shp senializaciones | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Sue_congelado.shp sue_congelado | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Sue_consolidado.shp sue_consolidado | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Sue_Costero.shp sue_costero | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Sue_Hidromorfologico.shp sue_hidromorfologico | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Sue_No_Consolidado.shp sue_no_consolidado | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Veg_Arborea.shp veg_arborea | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Veg_Arbustiva.shp veg_arbustiva | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Veg_Cultivos.shp veg_cultivos | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 veg_Hidrofila.shp veg_hidrofila | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Veg_Suelo_Desnudo.shp veg_suelo_desnudo | psql -d tpi_db -U postgres;
shp2pgsql -c -I -s 4326 Vias_Secundarias.shp vias_secundarias | psql -d tpi_db -U postgres;

# Ejecutar el script que crea una tabla vacía, en la que el usuario podrá insertar elementos
psql -d tpi_db -U postgres -f crear-tabla-lugares-gastronomicos.sql
