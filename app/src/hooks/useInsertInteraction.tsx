import { Map, MapBrowserEvent, Overlay } from "ol";
import { useMap } from "./useMap";
import { useEffect, useState } from "react";
import { Coordinate } from "ol/coordinate";

// URL de la API REST (servidor web conectado a la base de datos)
const URL = import.meta.env.VITE_API_SERVER_URL;

/** Crear un elemento que presente un efecto de onda. */
function addRippleOverlay(map: Map, coordinate: Coordinate) {
  const ripple = document.createElement("div");
  ripple.className = `animate-[pulse_0.8s_ease-in-out_1.5] size-[40px] rounded-full bg-gray-100 border-1 border-white opacity-90`;

  // Crear un overlay que sostenga al ripple
  const overlay = new Overlay({
    element: ripple,
    position: coordinate,
    positioning: "center-center",
    stopEvent: false,
  });

  map.addOverlay(overlay);
  ripple.addEventListener("animationend", () => map.removeOverlay(overlay));
}

export type GastronomyPlaceInputs = {
  tipo: "Restaurante" | "Bar" | "Cafetería" | "Solo Take Away" | "Otro";
  nombre: string;
  autor?: string;
};

export function useInsertInteraction() {
  const { map, activeOperation } = useMap();
  const [coordinate, setCoordinate] = useState<Coordinate>();
  // Cuando es `true`, se muestra un modal con un form para insertar un punto nuevo
  const isOpen = coordinate !== undefined;

  useEffect(() => {
    /**
     * Handler para el evento de un click durante la operación `insert`.
     * Muestra un formulario para insertar un nuevo punto en la coordenada clickeada.
     */
    function handleInsertionClick(e: MapBrowserEvent<MouseEvent>) {
      if (activeOperation !== "insert") {
        // No está activada la inserción de puntos
        return;
      }

      addRippleOverlay(map, e.coordinate);
      setCoordinate(e.coordinate);
    }

    map.on("click", handleInsertionClick);
    return () => map.un("click", handleInsertionClick);
  }, [activeOperation, map]);

  function closeInsert() {
    setCoordinate(undefined);
  }

  async function insertNewPoint(featureData: GastronomyPlaceInputs) {
    if (!coordinate) {
      return;
    }

    // La coordenada del punto clickeado tiene la forma `[lon, lat]`
    const wkt = `POINT(${coordinate[0]} ${coordinate[1]})`;
    const fechaCreado = new Date().toISOString();

    return fetch(`${URL}/insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wkt, fechaCreado, ...featureData }),
    }).then((res) => res.json());
  }

  return { isOpen, closeInsert, insertNewPoint };
}
