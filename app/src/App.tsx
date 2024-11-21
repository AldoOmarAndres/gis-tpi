import TileLayer from "ol/layer/Tile";
import "./App.css";
import { OSM, TileWMS } from "ol/source";
import { View, Map } from "ol";
import { useEffect, useRef, useState } from "react";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import "ol/ol.css";
import CAPAS from "./capas.ts";

type CapaParams = {
  id: string;
  nombre: string;
  isVisible: boolean;
};

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [capasVisibles, setCapasVisibles] = useState<string[]>([]);

  //Se puede hacer menos verboso creo.., tengo sueño :(
  const capasArray: CapaParams[] = [];
  CAPAS.map((c) =>
    capasArray.push({
      id: c,
      nombre: c
        .toLocaleLowerCase()
        .split("_")
        .map((nombre) => nombre.charAt(0).toUpperCase() + nombre.slice(1))
        .join(" "),
      isVisible: false,
    })
  );

  //const URL = process.env.VITE_QGIS_SERVER_URL;

  useEffect(() => {
    //if (!mapRef.current) return;

    // Crear el mapa
    /* const mapa = new Map({
      target: mapRef.current,
        layers: [
          new TileLayer({
            source: new TileWMS({
              url: "" + URL,
              params: {
                SERVICE: "WMS",
                VERSION: "1.3.0",
                REQUEST: "GetMap",
                LAYERS: capasVisibles,
                FORMAT: "image/png",
                CRS: "EPSG:22175"
              },
              serverType: "qgis",
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([-64.0, -34.0]), // Coordenadas iniciales para Arg
          zoom: 4,
        }),
      });

      setMap(mapa); */
    console.log("capas visibles:", capasVisibles);

    // Limpiar el mapa cuando el componente se desmonte
    //return () => map?.setTarget(undefined);
  }, [capasVisibles]);

  // Manejar cambios de visibilidad de capas
  const toggleCapa = (capaSelected: string) => {
    const capa = capasArray.find((c) => c.nombre === capaSelected);
    
    if (capa) {
      const newCapa = capa;
      newCapa.isVisible = !capa.isVisible;
      capasArray.splice(capasArray.indexOf(capa), 1, newCapa);
      console.log("Nuevo array", capasArray)

      console.log("Lo incluye?", capasVisibles.includes(capa.id));

      //Muy verboso esto
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

  console.log(capasArray);

  return (
    <div style={{ display: "flex" }}>
      {/* Menú de capas */}
      <div style={{ width: "280px", padding: "10px", background: "gray" }}>
        <h3>Capas</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {capasArray.map((capa) => (
            <li key={capa.id}>
              <label>
                <input
                  type="checkbox"
                  checked={capa.isVisible}
                  onChange={() => toggleCapa(capa.nombre)}
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
        style={{ flex: 1, width: "100%", height: "100%" }}
      ></div>
    </div>
  );
}

export default App;
