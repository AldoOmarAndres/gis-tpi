// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { exit } from "process";
import cors from "cors";
import postgres from "postgres";
import { LAYER_IDS } from "./capas";

dotenv.config({ path: [".env.local", ".env"] });

const app: Express = express();
const port = process.env.PORT || 3000;
const dbConnectionUrl = process.env.DATABASE_URL;

if (!dbConnectionUrl) {
  console.info("Missing `DATABASE_URL` environment variable. Exiting...");
  exit();
}

// Conectarse a la base de datos
const sql = postgres(dbConnectionUrl);

// Desactivar CORS
app.use(cors());

app.get("/query", async (req: Request, res: Response) => {
  // Capa vectorial en la que consultar features
  const layer = `${req.query.layer}`;
  if (!LAYER_IDS.includes(layer)) {
    res.status(400).send({ msg: `unknown layer '${layer}' is not valid` });
    return;
  }

  // Objeto que intersecta con las features, representado en formato WKT (Well Known Text)
  let wkt = `${req.query.wkt}`;
  if (!wkt) {
    res.status(400).send({ msg: "'wkt' query parameter is required" });
    return;
  }

  // Función SQL de PostGIS que interpreta la geometría en formato WKT
  let sqlGeometry = sql`ST_geomfromtext(${wkt}, 4326)`;

  if (wkt.includes("POINT(")) {
    // La consulta por punto indica cierto `radius` para crear un buffer
    const radius = Number(req.query.radius);
    if (!radius) {
      res.status(400).send({ msg: "'radius' is needed for POINT geometries" });
      return;
    }

    // La consulta por punto requiere añadirle un buffer al punto
    sqlGeometry = sql`ST_Buffer(ST_geomfromtext(${wkt}, 4326), ${radius})`;
  }

  // Consulta adaptada del ejemplo que usó el profe en un laboratorio
  const data = await sql`
    SELECT row_to_json(fc) AS geojson
    FROM (
      SELECT 'FeatureCollection' AS type, array_to_json(array_agg(f)) AS features
      FROM (
        SELECT 'Feature' AS type, ST_AsGeoJSON(geom)::json AS geometry, row_to_json(q) AS properties
        FROM (
          SELECT * 
          FROM ${sql(layer)}
          WHERE st_intersects(${sqlGeometry}, geom)
          ) as q
        ) AS f
      ) AS fc;
    `;

  res.send(data[0].geojson);
});

app.listen(port, () => {
  console.info(`[server]: Server is running at http://localhost:${port}`);
});
