import TileLayer from "ol/layer/Tile";
import "./App.css";
import { OSM, TileWMS } from "ol/source";
import { View, Map } from "ol";
import { useEffect, useRef, useState } from "react";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import CAPAS from "./capas.ts";

type CapaParams = {
  id: string;
  nombre: string;
  isVisible: boolean;
};

const capasArray: CapaParams[] = CAPAS.map((c) => ({
  id: c,
  // TODO: sería mejor especificar un nombre legible para cada capa, no derivarlo del identificador
  nombre: c
    .toLocaleLowerCase()
    .split("_")
    .map((nombre) => nombre.charAt(0).toUpperCase() + nombre.slice(1))
    .join(" "),
  isVisible: false,
}));

const osm = new TileLayer({
  source: new OSM(),
});

const URL = import.meta.env.VITE_QGIS_SERVER_URL;

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [capasVisibles, setCapasVisibles] = useState<string[]>([]);
  const [crc, setCrc] = useState<string>("EPSG:22175");

  useEffect(() => {
    if (!mapRef.current) return;

    // Crear el mapa
    const mapa = new Map({
      target: mapRef.current,
      layers: [
        osm,
        new TileLayer({
          source: new TileWMS({
            url: "" + URL,
            params: {
              SERVICE: "WMS",
              VERSION: "1.3.0",
              REQUEST: "GetMap",
              LAYERS: capasVisibles,
              FORMAT: "image/png",
              CRS: crc,
            },
            serverType: "qgis",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([-64.0, -34.0]), // Coordenadas iniciales para Arg
        zoom: 5,
      }),
    });

    setMap(mapa);
    console.log("capas visibles:", capasVisibles);

    // Limpiar el mapa cuando el componente se desmonte
    return () => map?.setTarget(undefined);
  }, [capasVisibles, crc]);

  // Manejar cambios de visibilidad de capas
  const toggleCapa = (capaSelected: string) => {
    const capa = capasArray.find((c) => c.id === capaSelected);

    if (capa) {
      const newCapa = capa;
      newCapa.isVisible = !capa.isVisible;
      capasArray.splice(capasArray.indexOf(capa), 1, newCapa);
      console.log("Nuevo array", capasArray);

      console.log("Lo incluye?", capasVisibles.includes(capa.id));

      if (!capasVisibles.includes(newCapa.id)) {
        newCapa.isVisible
          ? setCapasVisibles((prev) => [...prev, newCapa.id])
          : null;
      } else {
        newCapa.isVisible
          ? null
          : setCapasVisibles((prev) => prev.filter((c) => c !== newCapa.id));
      }
    }
    console.log(capasVisibles);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "280px", padding: "10px", background: "gray" }}>
        <h3>CRC</h3>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px" }}>
            <input
              type="radio"
              value="EPSG:22175"
              checked={crc === "EPSG:22175"}
              onChange={() => setCrc("EPSG:22175")}
            />
            EPSG:22175
          </label>
          <label>
            <input
              type="radio"
              value="EPSG:4326"
              checked={crc === "EPSG:4326"}
              onChange={() => setCrc("EPSG:4326")}
            />
            EPSG:4326
          </label>
        </div>

        {/* Menú de capas 
      // TODO: mejorar visual de listado
          //Se listan con nombres incompletos, los mismos que en array "CAPAS"
      */}
        <h3>Capas</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {capasArray.map((capa) => (
            <li key={capa.id}>
              <label>
                <input
                  type="checkbox"
                  checked={capa.isVisible}
                  onChange={() => toggleCapa(capa.id)}
                />
                {capa.nombre}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenedor del mapa */}
      <div
        ref={mapRef}
        style={{ flex: 1, width: "100%", height: "100hv" }}
      ></div>
    </div>
  );
}

export default App;
