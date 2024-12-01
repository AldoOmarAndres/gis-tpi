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
  const wkt = `${req.query.wkt}`;
  if (!wkt) {
    res.status(400).send({ msg: "'wkt' query parameter is required" });
    return;
  }

  // Consulta adaptada del ejemplo que usó el profe en el laboratorio
  const data = await sql`
    SELECT row_to_json(fc) AS geojson
    FROM (
      SELECT 'FeatureCollection' AS type, array_to_json(array_agg(f)) AS features
      FROM (
        SELECT 'Feature' AS type, ST_AsGeoJSON(geom)::json AS geometry, row_to_json(q) AS properties
        FROM (
          SELECT * 
          FROM ${sql(layer)}
          WHERE st_intersects(
            ST_geomfromtext(${wkt}, 4326),
            geom
            )
          ) as q
        ) AS f
      ) AS fc;
    `;

  res.send(data[0].geojson);
});

app.listen(port, () => {
  console.info(`[server]: Server is running at http://localhost:${port}`);
});
