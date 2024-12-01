import { LAYER_IDS, CRS, layerNameFromLayerId } from "@/lib/capas";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM, TileWMS } from "ol/source";
import { defaults as defaultControls, ScaleLine } from "ol/control";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from "react";
import { Interaction } from "ol/interaction";

// URL del QGIS Server
const URL = import.meta.env.VITE_QGIS_SERVER_URL;

// Capa base de Open Street Map
const osm = new TileLayer({
  source: new OSM(),
});

// Valor inicial para que `useState<Map>` no permita valores `undefined`
const defaultMap = new Map({
  target: "map",
  layers: [osm],
  view: new View({
    projection: CRS,
    center: fromLonLat([-64.0, -34.0], CRS), // Coordenadas iniciales para Argentina
    zoom: 5,
  }),
});

/** Operaciones que se pueden realizar sobre el mapa. La operación por defecto es 'navigate'. */
export type Operation = "navigate" | "measure-line" | "measure-area" | "query";

interface IMapContext {
  /** Referencia al tag HTML que contiene el mapa renderizado con Open Layers. */
  mapContainerRef: MutableRefObject<HTMLDivElement | null>;
  /** Mapa. Objeto de tipo `Map` de Open Layers. */
  map: Map;
  /** Capas temáticas del mapa correspondientes al IGN (no incluye la capa base). */
  layers: TileLayer[];
  /** ID de la capa activa actualmente, sobre la que se realizan las operaciones. */
  activeLayerId: string | undefined;
  /** Setter de `activeLayerId`. */
  setActiveLayerId: Dispatch<SetStateAction<string | undefined>>;
  /** Operación actualmente activa que se puede realizar sobre el mapa de la app. */
  activeOperation: Operation;
  /** Activar la operación `operation`. Esto desactiva las demás operaciones. */
  changeOperation: (operation: Operation) => void;
  setInteraction: Dispatch<SetStateAction<Interaction | undefined>>;
}

const MapContext = createContext<IMapContext | undefined>(undefined);

interface MapProviderProps {
  children?: React.ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map>(defaultMap);
  const [layers, setLayers] = useState<TileLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>();
  const [activeOperation, setActiveOperation] = useState<Operation>("navigate");
  const [interaction, setInteraction] = useState<Interaction>();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const layers = LAYER_IDS.map((layerId) => {
      return new TileLayer({
        visible: false,
        source: new TileWMS({
          url: `${URL}`,
          serverType: "qgis",
          params: {
            SERVICE: "WMS",
            VERSION: "1.3.0",
            REQUEST: "GetMap",
            LAYERS: layerId,
            FORMAT: "image/png",
            CRS: CRS,
          },
        }),
        properties: {
          id: layerId,
          name: layerNameFromLayerId(layerId),
        },
      });
    });

    const view = new View({
      projection: CRS,
      center: fromLonLat([-64.0, -34.0], CRS), // Coordenadas iniciales para Argentina
      zoom: 5,
    });

    // Control para la escala del mapa
    const scaleControl = new ScaleLine({
      units: "metric",
      bar: true,
      steps: 4,
      text: true,
      minWidth: 140,
    });

    const controls = defaultControls({ zoom: false }).extend([scaleControl]);

    const map = new Map({
      target: mapContainerRef.current,
      layers: [osm, ...layers],
      view,
      controls,
    });

    setLayers(layers);
    setMap(map);

    // Limpiar el mapa cuando el componente se desmonte
    return () => map?.setTarget(undefined);
  }, []);

  function changeOperation(operation: Operation) {
    if (activeOperation !== operation && interaction) {
      // Eliminar del mapa la interacción previamente activada
      map.removeInteraction(interaction);
    }

    setActiveOperation(operation);
  }

  return (
    <MapContext.Provider
      value={{
        layers,
        mapContainerRef,
        map,
        activeLayerId,
        setActiveLayerId,
        activeOperation,
        changeOperation,
        setInteraction,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("Error al usar un MapContext por fuera de un MapProvider");
  }
  return context;
}
