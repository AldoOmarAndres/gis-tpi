import { useMap } from "./useMap";
import { easeOut } from "ol/easing";

interface UseMapZoom {
  /** Dispara una animación en la `View` del `Map` sumando o restando `delta` al zoom. */
  zoomTo: (delta: number) => void;
}

/** Hook para manipular el zoom del mapa. */
export default function useMapZoom(): UseMapZoom {
  const { map } = useMap();

  function zoomTo(delta: number) {
    const view = map.getView();
    const currentZoom = view.getZoom();

    if (!currentZoom) {
      return;
    }

    const zoom = view.getConstrainedZoom(currentZoom + delta);
    // Parámetros sacados de "ol/control/Zoom.js" para que sea similar a la animación original
    view.animate({ zoom, duration: 250, easing: easeOut });
  }

  return { zoomTo };
}
