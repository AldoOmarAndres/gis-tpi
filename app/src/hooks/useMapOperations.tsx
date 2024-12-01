import { useMap } from "./useMap";
import { useEffect, useState } from "react";
import { Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import {
  useMeasureAreaInteraction,
  useMeasureLineInteraction,
} from "./useMeasureInteraction";
import { useQueryInteraction } from "./useQueryInteraction";
import { MapBrowserEvent } from "ol";
import { useToast } from "./use-toast";

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
  const { map, activeLayerId } = useMap();
  const [activeOperation, setActiveOperation] = useState<Operation>("navigate");
  const [interaction, setInteraction] = useState<Interaction>();
  const { measureLine, measureLineLayer } = useMeasureLineInteraction();
  const { measureArea, measureAreaLayer } = useMeasureAreaInteraction();
  const { dragBox, queryFeaturesByPoint } = useQueryInteraction();
  const { toast } = useToast();

  useEffect(() => {
    /** Handler para el evento de un click durante la operación `query`. */
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

      return queryFeaturesByPoint(e, activeLayerId);
    }

    map.on("click", handleQueryClick);
    return () => map.un("click", handleQueryClick);
  }, [activeLayerId, queryFeaturesByPoint, toast, activeOperation, map]);

  function changeOperation(operation: Operation) {
    if (activeOperation !== operation && interaction) {
      // Eliminar del mapa la interacción previamente activada
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

    setActiveOperation(operation);
  }

  return {
    activeOperation,
    changeOperation,
    measureLineLayer,
    measureAreaLayer,
  };
}
