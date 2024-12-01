import { MapBrowserEvent } from "ol";
import { always } from "ol/events/condition";
import { DragBox } from "ol/interaction";
import { useMap } from "./useMap";
import { useEffect } from "react";
import { useToast } from "./use-toast";

// URL de la API REST (servidor web conectado a la base de datos)
const URL = import.meta.env.VITE_API_SERVER_URL;

function fetchFeatures(
  layer: string,
  wkt: string,
  callback: (data: unknown) => void
) {
  fetch(`${URL}/query?layer=${layer}&wkt=${wkt}`)
    .then((res) => res.json())
    .then((data) => callback(data))
    .catch((err) => console.error(err));
}

const dragBox = new DragBox({ condition: always });

export function useQueryInteraction() {
  const { activeLayerId } = useMap();
  const { toast } = useToast();

  /** Consulta gráfica de todo lo intersectado por el punto clickeado. */
  function queryFeaturesByPoint(
    evt: MapBrowserEvent<MouseEvent>,
    layerId: string
  ) {
    const coordinate = evt.coordinate;

    // La coordenada del punto clickeado tiene la forma `[lon, lat]`
    const wkt = `POINT(${coordinate[0]} ${coordinate[1]})`;

    fetchFeatures(layerId, wkt, (data) => console.log(data));
  }

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

      fetchFeatures(activeLayerId, wkt, (data) => console.log(data));
    }

    dragBox.on("boxend", queryFeaturesByRectangle);
    return () => dragBox.un("boxend", queryFeaturesByRectangle);
  }, [activeLayerId, toast]);

  return { dragBox, queryFeaturesByPoint };
}
