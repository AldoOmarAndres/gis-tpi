import { useMap } from "./useMap";
import { useState } from "react";
import { Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import {
  useMeasureAreaInteraction,
  useMeasureLineInteraction,
} from "./useMeasureInteraction";
import { useQueryInteraction } from "./useQueryInteraction";

/** Operaciones que se pueden realizar sobre el mapa. La operación por defecto es 'navigate'. */
export type Operation = "navigate" | "measure-line" | "measure-area" | "query";

interface UseMapOperations {
  /** Operación actualmente activa que se puede realizar sobre el mapa de la app. */
  activeOperation: Operation;
  /** Activar la operación `operation`. Esto desactiva las demás operaciones. */
  changeOperation: (operation: Operation) => void;
  /** Capa vectorial donde se dibujan las líneas de la operación `measure-line`. */
  measureLineLayer: VectorLayer;
  /** Capa vectorial donde se dibujan los polígonos de la operación `measure-area`. */
  measureAreaLayer: VectorLayer;
}

/** Hook para manipular el zoom del mapa. */
export default function useMapOperations(): UseMapOperations {
  const { map } = useMap();
  const [activeOperation, setActiveOperation] = useState<Operation>("navigate");
  const [interaction, setInteraction] = useState<Interaction>();
  const { measureLine, measureLineLayer } = useMeasureLineInteraction();
  const { measureArea, measureAreaLayer } = useMeasureAreaInteraction();
  const dragBox = useQueryInteraction();

  function changeOperation(operation: Operation) {
    // Eliminar del mapa la interacción previamente activada
    if (interaction) {
      map.removeInteraction(interaction);
    }

    // Agregar al mapa la interacción actualmente activada
    if (operation === "measure-line") {
      map.addInteraction(measureLine);
      setInteraction(measureLine);
    } else if (operation === "measure-area") {
      map.addInteraction(measureArea);
      setInteraction(measureArea);
    } else if (operation === "query") {
      map.addInteraction(dragBox);
      setInteraction(dragBox);
    }

    console.log(map.getAllLayers().length);

    setActiveOperation(operation);
  }

  return {
    activeOperation,
    changeOperation,
    measureLineLayer,
    measureAreaLayer,
  };
}
