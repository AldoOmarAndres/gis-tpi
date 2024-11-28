import Draw from "ol/interaction/Draw.js";
import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { LineString, Polygon } from "ol/geom.js";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { getArea, getLength } from "ol/sphere.js";
import { unByKey } from "ol/Observable.js";
import { Feature, MapBrowserEvent } from "ol";

const source = new VectorSource();

const vector = new VectorLayer({
  source: source,
  style: {
    "fill-color": "rgba(255, 255, 255, 0.2)",
    "stroke-color": "#ffcc33",
    "stroke-width": 2,
    "circle-radius": 7,
    "circle-fill-color": "#ffcc33",
  },
});

/** Currently drawn feature. */
let sketch: Feature;

/** The help tooltip element. */
let helpTooltipElement: HTMLElement;

/** Overlay to show the help messages. */
let helpTooltip: Overlay;

/** The measure tooltip element. */
let measureTooltipElement: HTMLElement;

/** Overlay to show the measurement. */
let measureTooltip: Overlay;

/** Message to show when the user is drawing a polygon. */
const continuePolygonMsg = "Click to continue drawing the polygon";

/** Message to show when the user is drawing a line. */
const continueLineMsg = "Click to continue drawing the line";

/** Handle pointer move. */
function pointerMoveHandler(evt: MapBrowserEvent<UIEvent>) {
  if (evt.dragging) {
    return;
  }
  let helpMsg = "Click to start drawing";

  if (sketch) {
    const geom = sketch.getGeometry();
    helpMsg = geom instanceof Polygon ? continuePolygonMsg : continueLineMsg;
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove("hidden");
}

export function createMeasureInteraction(map: Map) {
  map.on("pointermove", pointerMoveHandler);
  map.addLayer(vector);

  map.getViewport().addEventListener("mouseout", function () {
    helpTooltipElement.classList.add("hidden");
  });

  let draw; // global so we can remove it later

  /**
   * Format length output.
   */
  function formatLength(line: LineString) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  }

  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   */
  function formatArea(polygon: Polygon) {
    const area = getArea(polygon, {
      projection: map.getView().getProjection(),
    });
    let output;
    if (area > 10000) {
      output = Math.round(area / 1000) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  }

  const style = new Style({
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
  });

  function addInteraction() {
    const type = "Polygon"; // o "LineString"
    draw = new Draw({
      source: source,
      type: type,
      style: function (feature) {
        const geometryType = feature.getGeometry()?.getType();
        if (geometryType === type || geometryType === "Point") {
          return style;
        }
      },
    });
    map.addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    let listener;
    draw.on("drawstart", function (evt) {
      // set sketch
      sketch = evt.feature;

      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      let tooltipCoord = [0, 0];

      listener = sketch.getGeometry()?.on("change", function (evt) {
        const geom = evt.target;
        let output = "";
        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    draw.on("drawend", function () {
      measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      // unset tooltip so that a new one can be created
      measureTooltipElement = null;
      createMeasureTooltip();
      unByKey(listener);
    });
  }

  /**
   * Creates a new help tooltip
   */
  function createHelpTooltip() {
    if (helpTooltipElement) {
      helpTooltipElement.remove();
    }
    helpTooltipElement = document.createElement("div");
    helpTooltipElement.className = "ol-tooltip hidden";
    helpTooltip = new Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    map.addOverlay(helpTooltip);
  }

  /**
   * Creates a new measure tooltip
   */
  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.remove();
    }
    measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    map.addOverlay(measureTooltip);
  }

  addInteraction();
}
