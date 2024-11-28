import Map from "ol/Map.js";
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
} from "ol/style.js";
import { Draw, Modify } from "ol/interaction.js";
import { Geometry, LineString, Point, Polygon } from "ol/geom.js";
import { Vector as VectorSource } from "ol/source.js";
import { getArea, getLength } from "ol/sphere.js";
import { FeatureLike } from "ol/Feature";
import RenderFeature from "ol/render/Feature";
import VectorLayer from "ol/layer/Vector";

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

const labelStyle = new Style({
  text: new Text({
    font: "14px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [3, 3, 3, 3],
    textBaseline: "bottom",
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
  }),
});

const tipStyle = new Style({
  text: new Text({
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

const modifyStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
  text: new Text({
    text: "Drag to modify",
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

const segmentStyle = new Style({
  text: new Text({
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textBaseline: "bottom",
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
});

const segmentStyles = [segmentStyle];

export function createMeasureInteraction(
  map: Map,
  geomType: "LineString" | "Polygon"
) {
  const formatLength = function (line: Geometry) {
    const length = getLength(line, {
      projection: map.getView().getProjection(),
    });

    const output =
      length > 100
        ? Math.round((length / 1000) * 100) / 100 + " km"
        : Math.round(length * 100) / 100 + " m";
    return output;
  };

  const formatArea = function (polygon: Geometry) {
    const area = getArea(polygon, {
      projection: map.getView().getProjection(),
    });

    const output =
      area > 10000
        ? Math.round((area / 1000000) * 100) / 100 + " km\xB2"
        : Math.round(area * 100) / 100 + " m\xB2";
    return output;
  };

  const source = new VectorSource();

  const modify = new Modify({ source: source, style: modifyStyle });

  let tipPoint: Geometry | RenderFeature;

  function styleFunction(
    feature: FeatureLike,
    showSegments: boolean = true,
    drawType: "LineString" | "Polygon" = "LineString",
    tip: string | undefined
  ) {
    const styles = [];
    const geometry = feature.getGeometry()!;
    const type = geometry.getType();

    let point, label, line;
    if (!drawType || drawType === type || type === "Point") {
      styles.push(style);
      if (geometry instanceof Polygon) {
        point = geometry.getInteriorPoint();
        label = formatArea(geometry);
        line = new LineString(geometry.getCoordinates()[0]);
      } else if (geometry instanceof LineString) {
        point = new Point(geometry.getLastCoordinate());
        label = formatLength(geometry);
        line = geometry;
      }
    }

    if (showSegments && line) {
      let count = 0;
      line.forEachSegment(function (a, b) {
        const segment = new LineString([a, b]);
        const label = formatLength(segment);
        if (segmentStyles.length - 1 < count) {
          segmentStyles.push(segmentStyle.clone());
        }
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        segmentStyles[count].setGeometry(segmentPoint);
        segmentStyles[count].getText()?.setText(label);
        styles.push(segmentStyles[count]);
        count++;
      });
    }
    if (label && point) {
      labelStyle.setGeometry(point);
      labelStyle.getText()?.setText(label);
      styles.push(labelStyle);
    }
    if (
      tip &&
      type === "Point" &&
      !modify.getOverlay().getSource()?.getFeatures().length
    ) {
      tipPoint = geometry;
      tipStyle.getText()?.setText(tip);
      styles.push(tipStyle);
    }
    return styles;
  }

  const vector = new VectorLayer({
    source: source,
    style: function (feature) {
      return styleFunction(feature, true, "LineString", "sarasa");
    },
  });

  map.addLayer(vector);
  map.addInteraction(modify);
  console.log(map.getLayers());

  let draw: Draw; // global so we can remove it later

  function addInteraction() {
    const activeTip =
      "Click to continue drawing the " +
      (geomType === "Polygon" ? "polygon" : "line");
    const idleTip = "Click to start measuring";
    let tip = idleTip;

    draw = new Draw({
      source: source,
      type: geomType,
      style: function (feature) {
        return styleFunction(feature, true, geomType, tip);
      },
    });

    draw.on("drawstart", function () {
      // source.clear();
      modify.setActive(false);
      tip = activeTip;
    });

    draw.on("drawend", function () {
      modifyStyle.setGeometry(tipPoint as Geometry);
      modify.setActive(true);
      map.once("pointermove", function () {
        modifyStyle.setGeometry();
      });
      tip = idleTip;
    });
    modify.setActive(true);
    map.addInteraction(draw);
    return draw;
  }

  // typeSelect.onchange = function () {
  //   map.removeInteraction(draw);
  //   addInteraction();
  // };

  return addInteraction();
}
