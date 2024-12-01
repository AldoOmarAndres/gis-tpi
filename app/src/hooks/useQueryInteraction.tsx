import { Map, MapBrowserEvent, Overlay } from "ol";
import { always } from "ol/events/condition";
import { DragBox } from "ol/interaction";
import { useMap } from "./useMap";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { Coordinate } from "ol/coordinate";

// URL de la API REST (servidor web conectado a la base de datos)
const URL = import.meta.env.VITE_API_SERVER_URL;

const dragBox = new DragBox({ condition: always });

/** Crear un elemento que presente un efecto de onda. */
function addRippleOverlay(map: Map, coordinate: Coordinate) {
  const ripple = document.createElement("div");
  // En `size-[{side}px]` el valor de side debe ser el doble del `radiusPixel`
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

export function useQueryInteraction() {
  const { map, activeLayerId, activeOperation, setInteraction } = useMap();
  const { toast } = useToast();
  const [queryData, setQueryData] = useState<unknown & { layer: string }>();

  useEffect(() => {
    /**
     * Handler para el evento de un click durante la operación `query`.
     * Realiza la consulta gráfica de todo lo intersectado por el punto clickeado.
     */
    function handleQueryClick(e: MapBrowserEvent<MouseEvent>) {
      if (activeOperation !== "query") {
        // No está activada la consulta de elementos
        return;
      }

      if (!activeLayerId) {
        toast({
          variant: "destructive",
          title: "¡Uy! No hay una capa activada.",
          description:
            "Se necesita una capa activa para poder consultar sus elementos.",
        });
        return;
      }

      // La coordenada del punto clickeado tiene la forma `[lon, lat]`
      const wkt = `POINT(${e.coordinate[0]} ${e.coordinate[1]})`;
      // Incluir los elementos a un radio de `bufferRadiusPixels` píxeles de la coordenada clickeada
      const radiusPixels = 20;
      // Ref: https://openlayers.org/en/latest/apidoc/module-ol_View-View.html
      // resolución = unidades de la proyección por píxel
      const degreesPerPixel = map.getView().getResolution() ?? 1;
      const radiusDegrees = radiusPixels * degreesPerPixel;

      addRippleOverlay(map, e.coordinate);

      fetch(
        `${URL}/query?layer=${activeLayerId}&wkt=${wkt}&radius=${radiusDegrees}`
      )
        .then((res) => res.json())
        .then((data) => {
          data.layer = activeLayerId;
          setQueryData(data);
        })
        .catch((err) => console.error(err));
    }

    map.on("click", handleQueryClick);
    return () => map.un("click", handleQueryClick);
  }, [activeLayerId, toast, activeOperation, map]);

  useEffect(() => {
    /** Consulta gráfica de todo lo intersectado por el rectángulo dibujado. */
    function queryFeaturesByRectangle() {
      if (!activeLayerId) {
        toast({
          variant: "destructive",
          title: "¡Uy! No hay una capa activada.",
          description:
            "Se necesita una capa activa para poder consultar sus elementos.",
        });
        return;
      }

      const coordinates = dragBox.getGeometry().getCoordinates();

      // El rectángulo es un arreglo de pares de coordenadas. Una coordenada tiene la forma `[lon, lat]`
      let wkt = "POLYGON((";
      for (let i = 0; i < coordinates[0].length - 1; i++) {
        wkt += `${coordinates[0][i][0]} ${coordinates[0][i][1]},`;
      }
      wkt += `${coordinates[0][0][0]} ${coordinates[0][0][1]}))`;

      fetch(`${URL}/query?layer=${activeLayerId}&wkt=${wkt}`)
        .then((res) => res.json())
        .then((data) => {
          data.layer = activeLayerId;
          setQueryData(data);
        })
        .catch((err) => console.error(err));
    }

    dragBox.on("boxend", queryFeaturesByRectangle);
    return () => dragBox.un("boxend", queryFeaturesByRectangle);
  }, [activeLayerId, toast]);

  useEffect(() => {
    if (activeOperation === "query") {
      // No está activada la consulta de elementos por rectángulos
      map.addInteraction(dragBox);
      setInteraction(dragBox);
    }
  }, [setInteraction, activeOperation, map]);

  return { dragBox, queryData };
}
