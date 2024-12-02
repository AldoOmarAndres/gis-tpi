import { Map, MapBrowserEvent, Overlay } from "ol";
import { useMap } from "./useMap";
import { useEffect, useState } from "react";
import { Coordinate } from "ol/coordinate";
import { useToast } from "./use-toast";
import { TileWMS } from "ol/source";

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
  const { layers, map, activeOperation } = useMap();
  const { toast } = useToast();
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

    try {
      await fetch(`${URL}/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wkt, fechaCreado, ...featureData }),
      });

      // Recargar la capa vectorial para que aparezca el punto recién guardado
      const layer = layers.find((l) => l.get("id") === "lugares_gastronomicos");
      const wmsSource = layer?.getSource() as TileWMS;
      const params = wmsSource.getParams();
      params.t = new Date().getTime(); // Agregar un timestamp para romper el cache
      wmsSource.updateParams(params);

      toast({
        title: "Lugar gastronómico guardado correctamente.",
        className: "bg-green-300 border-green-400",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "¡Uy! Algo salió mal al intentar insertar el elemento.",
        description:
          "Si no se guardó el lugar gastronómico, intente nuevamente.",
      });
    }
  }

  return { isOpen, closeInsert, insertNewPoint };
}
