-- Este script crea la tabla necesaria para que el usuario pueda insertar nuevos elementos
-- Habilitar la extensión PostGIS (si todavía no está habilitada)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Crear la tabla `lugares_gastronomicos` con geometría de punto
CREATE TABLE lugares_gastronomicos (
    id SERIAL PRIMARY KEY,                            -- Unique identifier
    tipo VARCHAR(50) NOT NULL CHECK (
        tipo IN ('Restaurante', 'Bar', 'Cafetería', 'Solo Take Away', 'Otro')
    ),                                                -- El tipo de lugar gastronómico
    nombre VARCHAR(255) NOT NULL,                   -- Nombre del lugar
    autor VARCHAR(255) NOT NULL,                    -- Autor de la entrada
    geom GEOMETRY(Point, 4326) NOT NULL,              -- Columna de geometría EPSG:4326 (WGS 84)
    fecha_creado TIMESTAMP DEFAULT NOW() NOT NULL     -- Timestamp de la creación
);
