import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import { LineString, Polygon } from "ol/geom";
import Geometry from "ol/geom/Geometry";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import Overlay, { Positioning } from "ol/Overlay.js";
import VectorSource from "ol/source/Vector";
import { getArea, getLength } from "ol/sphere";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

function addOverlay(map: Map, isPrimary: boolean) {
  const element = document.createElement("div");
  const offset = [0, -15];
  const positioning: Positioning = "bottom-center";
  const className = isPrimary
    ? "bg-yellow-300 border-yellow-400 border-2 rounded-md p-2 leading-none opacity-90"
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

export function createMeasureInteraction(
  map: Map,
  geomType: "LineString" | "Polygon"
) {
  const source = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
      }),
    }),
  });

  map.addLayer(vectorLayer);

  const draw = new Draw({ source: source, type: geomType });
  draw.on("drawstart", onDrawStart);

  map.addInteraction(draw);

  let coordinatesLength: number;
  let partDistanceOverlay: Overlay | null;
  let totalAreaDistanceOverlay: Overlay;
  let lastPartLineOverlay: Overlay;

  /** Esta función es llamada cuando se comienza a dibujar. */
  function onDrawStart(e: DrawEvent) {
    //It will store the coordinates length of geometry
    coordinatesLength = 0;

    //partDistanceOverlay is used to display the label of distance measurements on each segment of Line and Polygon geomtry
    partDistanceOverlay = null;

    //totalAreaDistanceOverlay is used to display the total distance if geomtery is LineString or it will display the area if geomtry is Polygon
    totalAreaDistanceOverlay = addOverlay(map, true);

    //lastPartLineOverlay is used to display the distance measurement of last segment of Polygon which is its last two coordinates
    lastPartLineOverlay = addOverlay(map, false);

    //Binding onGeomChange function with drawing feature
    e.feature.getGeometry()?.on("change", onGeomChange);
  }

  // /** Esta función es llamada cuando se termina de dibujar. */
  // function onDrawEnd(e: DrawEvent) {
  //   // Agregar geometría dibujada a la capa vectorial
  //   vectorLayer.getSource()?.addFeature(e.feature);
  // }

  /** Esta función es llamada cuando cambia la geometría. Ej: cuando aumenta la longitud, area, etc. */
  function onGeomChange(e: BaseEvent) {
    const geometry: Geometry = e.target;
    const geomType = e.target.getType();
    let coordinates = e.target.getCoordinates();
    if (geomType == "Polygon") {
      coordinates = e.target.getCoordinates()[0];
    }

    // This logic will check if the new coordinates are added to geometry. If yes, then It will create a overlay for the new segment
    if (coordinates.length > coordinatesLength) {
      partDistanceOverlay = addOverlay(map, false);
      coordinatesLength = coordinates.length;
    } else {
      coordinatesLength = coordinates.length;
    }

    let partLine = new LineString([
      coordinates[coordinatesLength - 2],
      coordinates[coordinatesLength - 1],
    ]);

    if (geomType == "Polygon") {
      partLine = new LineString([
        coordinates[coordinatesLength - 3],
        coordinates[coordinatesLength - 2],
      ]);
    }

    // this calculates the length of a segment and position the overlay at the midpoint of it
    calDistance(partDistanceOverlay!, partLine.getFlatMidpoint(), partLine);

    // if geometry is LineString and coordinates_length is greater than 2, then calculate the total length of the line and set the position of the overlay at last coordninates
    if (
      geometry instanceof LineString &&
      coordinatesLength > 2 &&
      e.target.getLength() >
        new LineString([coordinates[0], coordinates[1]]).getLength()
    ) {
      calDistance(
        totalAreaDistanceOverlay,
        coordinates[coordinatesLength - 1],
        geometry
      );
    }

    // If geometry is Polygon, then it will create the overlay for area measurement and last segment of it which is its first and last coordinates.
    if (geometry instanceof Polygon && coordinatesLength > 3) {
      calArea(
        totalAreaDistanceOverlay,
        e.target.getFlatInteriorPoint(),
        geometry
      );
      partLine = new LineString([
        coordinates[coordinatesLength - 2],
        coordinates[coordinatesLength - 1],
      ]);
      calDistance(lastPartLineOverlay, partLine.getFlatMidpoint(), partLine);
    }
  }

  // Calculates the length of a segment and position the overlay at the midpoint of it.
  function calDistance(
    overlay: Overlay,
    overlayPosition: Coordinate,
    line: LineString
  ) {
    const distance = getLength(line, {
      projection: map.getView().getProjection(),
    });

    if (distance === 0) {
      overlay.setPosition([0, 0]);
    } else {
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
  }

  // Calculates the area of Polygon and position the overlay at the center of polygon
  function calArea(
    overlay: Overlay,
    overlayPosition: Coordinate,
    polygon: Polygon
  ) {
    const area = getArea(polygon, {
      projection: map.getView().getProjection(),
    });

    if (area === 0) {
      overlay.setPosition([0, 0]);
    } else {
      overlay.setPosition(overlayPosition);
      const element = overlay.getElement();

      if (!element) {
        return;
      }

      if (area >= 10000) {
        element.innerHTML =
          Math.round((area / 1000000) * 100) / 100 + " km<sup>2<sup>";
      } else {
        element.innerHTML = Math.round(area * 100) / 100 + " m<sup>2<sup>";
      }
    }
  }

  return draw;
}
