import TileLayer from "ol/layer/Tile";
import "./App.css";
import { OSM, TileWMS } from "ol/source";
import { View, Map } from "ol";
import { useEffect, useRef, useState } from "react";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import LAYER_IDS from "./capas.ts";

type Layer = {
  id: string;
  name: string;
  isVisible: boolean;
};

const layers: Layer[] = LAYER_IDS.map((c) => ({
  id: c,
  // TODO: sería mejor especificar un nombre legible para cada capa, no derivarlo del identificador
  name: c
    .toLocaleLowerCase()
    .split("_")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" "),
  isVisible: false,
}));

const URL = import.meta.env.VITE_QGIS_SERVER_URL;

const osm = new TileLayer({
  source: new OSM(),
});

const view = new View({
  center: fromLonLat([-64.0, -34.0]), // Coordenadas iniciales para Argentina
  zoom: 5,
});

function App() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);
  const [crc, setCrc] = useState<string>("EPSG:22175");

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        osm,
        new TileLayer({
          source: new TileWMS({
            url: `${URL}`,
            serverType: "qgis",
            params: {
              SERVICE: "WMS",
              VERSION: "1.3.0",
              REQUEST: "GetMap",
              LAYERS: visibleLayers,
              FORMAT: "image/png",
              CRS: crc,
            },
          }),
        }),
      ],
      view,
    });

    // Limpiar el mapa cuando el componente se desmonte
    return () => map?.setTarget(undefined);
  }, [visibleLayers, crc]);

  // Manejar cambios de visibilidad de capas
  function toggleLayerVisibility(selectedLayer: string) {
    const layer = layers.find((c) => c.id === selectedLayer);

    if (!layer) {
      return;
    }

    layer.isVisible = !layer.isVisible;

    if (layer.isVisible) {
      // Mostrar la capa
      setVisibleLayers((prev) => [...prev, layer.id]);
    } else {
      // Ocultar la capa
      setVisibleLayers((prev) => prev.filter((c) => c !== layer.id));
    }
  }

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
        TODO: mejorar visual de listado
        Se listan con nombres incompletos, los mismos que en array "CAPAS"
        */}
        <h3>Capas</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {layers.map((capa) => (
            <li key={capa.id}>
              <label>
                <input
                  type="checkbox"
                  checked={capa.isVisible}
                  onChange={() => toggleLayerVisibility(capa.id)}
                />
                {capa.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenedor del mapa */}
      <div
        ref={mapContainerRef}
        style={{ flex: 1, width: "100%", height: "100hv" }}
      ></div>
    </div>
  );
}

export default App;
