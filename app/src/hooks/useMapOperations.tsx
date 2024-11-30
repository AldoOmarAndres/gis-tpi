import { useMap } from "./useMap";
import { useState } from "react";
import { Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import {
  useMeasureAreaInteraction,
  useMeasureLineInteraction,
} from "./useMeasureInteraction";

/** Operaciones que se pueden realizar sobre el mapa. La operación por defecto es 'navigate'. */
export type OperationType =
  | "navigate"
  | "measure-line"
  | "measure-area"
  | "query"
  | string;

interface UseMapOperations {
  /** Operación actualmente activa que se puede realizar sobre el mapa de la app. */
  activeOperation: OperationType;
  /** Activar la operación `operation`. Esto desactiva las demás operaciones. */
  changeOperation: (operation: OperationType) => void;
  /** Capa vectorial donde se dibujan las líneas de la operación `measure-line`. */
  measureLineLayer: VectorLayer;
  /** Capa vectorial donde se dibujan los polígonos de la operación `measure-area`. */
  measureAreaLayer: VectorLayer;
}

/** Hook para manipular el zoom del mapa. */
export default function useMapOperations(): UseMapOperations {
  const { map } = useMap();
  const [activeOperation, setActiveOperation] =
    useState<OperationType>("navigate");
  const [interaction, setInteraction] = useState<Interaction>();
  const { measureLine, measureLineLayer } = useMeasureLineInteraction();
  const { measureArea, measureAreaLayer } = useMeasureAreaInteraction();

  function changeOperation(operation: OperationType) {
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
    }

    setActiveOperation(operation);
  }

  return {
    activeOperation,
    changeOperation,
    measureLineLayer,
    measureAreaLayer,
  };
}
