import { createMeasureInteraction } from "@/lib/measure-interaction";
import { useMap } from "./useMap";
import { useState } from "react";
import { Interaction } from "ol/interaction";

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
}

/** Hook para manipular el zoom del mapa. */
export default function useMapOperations(): UseMapOperations {
  const { map } = useMap();
  const [activeOperation, setActiveOperation] =
    useState<OperationType>("navigate");
  const [interaction, setInteraction] = useState<Interaction>();

  function changeOperation(operation: OperationType) {
    // Eliminar del mapa la interacción previamente activada
    if (interaction) {
      map.removeInteraction(interaction);
    }

    // Agregar al mapa la interacción actualmente activada
    if (operation === "measure-line") {
      const draw = createMeasureInteraction(map, "LineString");
      setInteraction(draw);
    } else if (operation === "measure-area") {
      const draw = createMeasureInteraction(map, "Polygon");
      setInteraction(draw);
    }

    setActiveOperation(operation);
  }

  return { activeOperation, changeOperation };
}
