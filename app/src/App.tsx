import TileLayer from "ol/layer/Tile";
import "./App.css";
import { OSM, TileWMS } from "ol/source";
import { View, Map } from "ol";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // URL del servicio WMS en QGIS Server
    const URL =
      "http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe?MAP=C:/Users/anbra/Desktop/TPI.qgs";

    // Crear la capa WMS
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: URL,
        params: {
          LAYERS: "pais_lim",
          TILED: true,
          VERSION: "1.3.0",
          FORMAT: "image/png",
        },
        serverType: "qgis",
      }),
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(), // Agrega una capa base de OpenStreetMap
        }),
        wmsLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <>
      <div id="map" className="map" tabIndex={0}></div>
    </>
  );
}

export default App;
