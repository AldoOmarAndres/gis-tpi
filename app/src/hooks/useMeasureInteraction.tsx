import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import { LineString, Polygon } from "ol/geom";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import Overlay, { Positioning } from "ol/Overlay.js";
import VectorSource from "ol/source/Vector";
import { getArea, getLength } from "ol/sphere";
import { useMap } from "./useMap";
import { useMemo } from "react";

/** Crear un overlay (popup con texto) y agregarlo al mapa. */
function addOverlay(map: Map, isPrimary: boolean) {
  const element = document.createElement("div");
  const offset = [0, -15];
  const positioning: Positioning = "bottom-center";
  const className = isPrimary
    ? "text-sm bg-yellow-300 border-yellow-400 border-2 rounded-md p-1 leading-none opacity-90 z-10"
    : "text-xs bg-yellow-100 border-yellow-200 border-2 rounded-md p-1 leading-none opacity-90";

  const overlay = new Overlay({
    element,
    offset,
    positioning,
    className,
    stopEvent: false,
    insertFirst: false,
    position: [0, 0],
  });

  map.addOverlay(overlay);
  return overlay;
}

/** Medir la distancia de una línea e insertarla en un overlay del mapa. */
function measureDistance(
  map: Map,
  line: LineString,
  overlay: Overlay,
  overlayPosition: Coordinate
) {
  const distance = getLength(line, {
    projection: map.getView().getProjection(),
  });

  if (distance === 0) {
    overlay.setPosition([0, 0]);
    return;
  }

  overlay.setPosition(overlayPosition);
  const element = overlay.getElement();

  if (!element) {
    return;
  }

  if (distance >= 1000) {
    element.innerHTML = (distance / 1000).toFixed(2) + " km";
  } else {
    element.innerHTML = distance.toFixed(2) + " m";
  }
}

/** Medir el área del polígono e insertarla en un overlay del mapa. */
function measureArea(
  map: Map,
  polygon: Polygon,
  overlay: Overlay,
  overlayPosition: Coordinate
) {
  const area = getArea(polygon, { projection: map.getView().getProjection() });

  if (area === 0) {
    overlay.setPosition([0, 0]);
    return;
  }

  overlay.setPosition(overlayPosition);
  const element = overlay.getElement();

  if (!element) {
    return;
  }

  if (area >= 10000) {
    element.innerHTML = (area / 1_000_000).toFixed(2) + " km<sup>2<sup>";
  } else {
    element.innerHTML = area.toFixed(2) + " m<sup>2<sup>";
  }
}

function createMeasureInteraction(
  map: Map,
  geometryType: "LineString" | "Polygon"
) {
  const source = new VectorSource();
  const layer = new VectorLayer({ source });

  const draw = new Draw({ source, type: geometryType });
  draw.on("drawstart", onDrawStart);

  map.removeLayer(layer); // Evitar error de capa duplicada si se llama dos veces esta función
  map.addLayer(layer);

  let coordinatesLength: number;
  let partDistanceOverlay: Overlay | null;
  let totalDistanceOrAreaOverlay: Overlay;
  let lastPartLineOverlay: Overlay;

  /** Esta función es llamada cuando se comienza a dibujar. */
  function onDrawStart(e: DrawEvent) {
    // Guarda la cantidad de coordenadas de la geometría
    coordinatesLength = 0;

    // Es el overlay para mostrar las distancias de cada segmento del polígono
    partDistanceOverlay = null;

    // Es el overlay para mostrar el área del polígono
    totalDistanceOrAreaOverlay = addOverlay(map, true);

    // Es el overlay para mostrar la distancia del último segmento del polígono
    lastPartLineOverlay = addOverlay(map, false);

    e.feature.getGeometry()?.on("change", onGeometryChange);
  }

  /** Esta función es llamada cuando cambia la geometría. Ej: cuando aumenta la longitud, area, etc. */
  function onGeometryChange(e: BaseEvent) {
    const geometry: LineString | Polygon = e.target;
    const isLineStringGeometry = geometry instanceof LineString;
    const coordinates = isLineStringGeometry
      ? e.target.getCoordinates()
      : e.target.getCoordinates()[0];

    // Si se agregó una nueva coordenada a la geometría, crear un overlay para el nuevo segmento
    if (coordinates.length > coordinatesLength) {
      partDistanceOverlay = addOverlay(map, false);
    }

    coordinatesLength = coordinates.length;
    let partLine = new LineString([
      coordinates[coordinatesLength - 2],
      coordinates[coordinatesLength - 1],
    ]);
    if (!isLineStringGeometry) {
      partLine = new LineString([
        coordinates[coordinatesLength - 3],
        coordinates[coordinatesLength - 2],
      ]);
    }

    // Calcular la longitud del último segmento y colocar el overlay en su punto medio
    measureDistance(
      map,
      partLine,
      // `partDistanceOverlay` nunca es `null` porque siempre se le escribe un overlay en la primera llamada a esta función
      partDistanceOverlay!,
      partLine.getFlatMidpoint()
    );

    // Si hay más de dos coordenadas en la línea, calcular y mostrar su longitud total
    if (isLineStringGeometry && coordinatesLength > 2) {
      measureDistance(
        map,
        geometry,
        totalDistanceOrAreaOverlay,
        coordinates[coordinatesLength - 1]
      );
    }

    // Si hay al menos 2 lados en el polígono...
    if (!isLineStringGeometry && coordinatesLength > 3) {
      // Calcular el área y mostrarla en el centro del polígono
      measureArea(
        map,
        geometry,
        totalDistanceOrAreaOverlay,
        e.target.getFlatInteriorPoint()
      );

      partLine = new LineString([
        coordinates[coordinatesLength - 2],
        coordinates[coordinatesLength - 1],
      ]);

      // Calcular y mostrar la distancia del último segmento (que une la última coordenada del polígono con la primera)
      measureDistance(
        map,
        partLine,
        lastPartLineOverlay,
        partLine.getFlatMidpoint()
      );
    }
  }

  return { draw, layer };
}

export function useMeasureLineInteraction() {
  const { map } = useMap();
  const { draw, layer } = useMemo(
    () => createMeasureInteraction(map, "LineString"),
    [map]
  );

  return { measureLine: draw, measureLineLayer: layer };
}

export function useMeasureAreaInteraction() {
  const { map } = useMap();
  const { draw, layer } = useMemo(
    () => createMeasureInteraction(map, "Polygon"),
    [map]
  );

  return { measureArea: draw, measureAreaLayer: layer };
}
