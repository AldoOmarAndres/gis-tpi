import { LAYER_IDS, CRS } from "@/lib/capas";
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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const layers = LAYER_IDS.map((layer_id) => {
      return new TileLayer({
        visible: false,
        source: new TileWMS({
          url: `${URL}`,
          serverType: "qgis",
          params: {
            SERVICE: "WMS",
            VERSION: "1.3.0",
            REQUEST: "GetMap",
            LAYERS: layer_id,
            FORMAT: "image/png",
            CRS: CRS,
          },
        }),
        properties: {
          id: layer_id,
          // TODO: sería mejor especificar un nombre legible para cada capa, no derivarlo del identificador
          name: layer_id
            .toLocaleLowerCase()
            .split("_")
            .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
            .join(" "),
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

  return (
    <MapContext.Provider
      value={{
        layers,
        mapContainerRef,
        map,
        activeLayerId,
        setActiveLayerId,
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
