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
import CAPAS from "./capas.ts"

type CapaParams = {
  nombre:string,
  isVisible: boolean,
}

function App() {

  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [capasVisibles, setCapasVisibles] = useState(47)

  //Se puede hacer menos verboso creo.., tengo sueño :(
  const capasArray : CapaParams[] = []
  CAPAS.map((c) => capasArray.push({
    nombre:c,
    isVisible:true
  }))

  useEffect(() => {
    /* if (!mapRef.current) return;

      // Crear el mapa
      const mapa = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new TileWMS({
              url: "http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe?MAP=C:/Users/aldoa/Documents/qgis_tp.qgz",
              params: {
                SERVICE: "WMS",
                VERSION: "1.3.0",
                REQUEST: "GetMap",
                LAYERS: capasArray.map(c => c.isVisible ? c.nombre : null),
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
      console.log(capasVisibles)
      console.log("Solo trues",capasArray.filter(c => c.isVisible))

    // Limpiar el mapa cuando el componente se desmonte
    //return () => map?.setTarget(undefined);
    //No me queda claro que hace esto, lo tiró el amigo, lo comento x ahora
  }, [capasVisibles]);


  /* return (
    <div>
      <h1>Prueba</h1>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  ); */

    // Manejar cambios de visibilidad de capas
    const toggleCapa = (capaSelected: string) => {
      const capa = capasArray.find((c) => c.nombre === capaSelected);
      //no la pense demasiado
      if (capa) {
        capa.isVisible = !capa.isVisible;
      }
      console.log(capa)
      setCapasVisibles(capasArray.filter(c => c.isVisible).length)
      
    };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Menú de capas */}
      <div style={{ width: "250px", padding: "10px", background: "#f4f4f4" }}>
        <h3>Capas</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {capasArray.map((capa, index) => (
            <li key={index}>
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
