import { createMeasureInteraction } from "@/lib/measure1-interaction";
import { useMap } from "./useMap";
import { OperationType } from "@/models";
import { useMemo, useState } from "react";
import { Interaction } from "ol/interaction";

interface UseMapOperations {
  /** Activa la operación de tipo `OperationType` y desactiva el resto.. */
  activateOperation: (operation: OperationType) => void;
}

/** Hook para manipular el zoom del mapa. */
export default function useMapOperations(): UseMapOperations {
  const { map } = useMap();
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  const activateOperation = useMemo(
    () => (operation: OperationType) => {
      if (operation === "measure-area") {
        const draw = createMeasureInteraction(map, "Polygon");
        setInteractions((is) => [...is, draw]);
      } else {
        interactions.forEach((i) => {
          map.removeInteraction(i);
        });
        console.log(map.getInteractions());
      }
    },
    [map, interactions]
  );

  return { activateOperation };
}
