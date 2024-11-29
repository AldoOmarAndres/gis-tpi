import { createMeasureInteraction } from "@/lib/measure1-interaction";
import { useMap } from "./useMap";
import { OperationType } from "@/models";
import { useState } from "react";
import { Interaction } from "ol/interaction";

interface UseMapOperations {
  /** Operación actualmente activa que se puede realizar en esta app. */
  activeOperation: OperationType;
  /** Activar la operación `operation`. Esto desactiva todas las demás operaciones. */
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
