import LAYER_IDS from "@/capas";
import { CRS } from "@/models";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM, TileWMS } from "ol/source";
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

export type Layer = {
  id: string;
  name: string;
  isVisible: boolean;
};

const layers: Layer[] = LAYER_IDS.map((layer_id) => ({
  id: layer_id,
  // TODO: sería mejor especificar un nombre legible para cada capa, no derivarlo del identificador
  name: layer_id
    .toLocaleLowerCase()
    .split("_")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" "),
  isVisible: false,
}));

const URL = import.meta.env.VITE_QGIS_SERVER_URL;

const osm = new TileLayer({
  source: new OSM(),
});

interface IMapContext {
  /** Capas del mapa. */
  layers: Layer[];
  /** Sistema de Referencia de Coordenadas actual. */
  crs: CRS | string;
  /** Setter de `crs`. */
  setCRS: Dispatch<SetStateAction<CRS | string>>;
  /** Capas actualmente visibles. */
  visibleLayers: string[];
  /** Setter de `visibleLayers`. */
  setVisibleLayers: Dispatch<SetStateAction<string[]>>;
  /** Referencia al tag HTML que contiene el mapa renderizado con Open Layers. */
  mapContainerRef: MutableRefObject<HTMLDivElement | null>;
}

const MapContext = createContext<IMapContext | undefined>(undefined);

interface MapProviderProps {
  children?: React.ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [crs, setCRS] = useState<CRS | string>(CRS.EPSG_4326);
  const [visibleLayers, setVisibleLayers] = useState<string[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new Map({
      target: "map",
      layers: [
        osm,
        new TileLayer({
          source: new TileWMS({
            url: `${URL}`,
            serverType: "qgis",
            params: {
              SERVICE: "WMS",
              VERSION: "1.3.0",
              REQUEST: "GetMap",
              LAYERS: visibleLayers,
              FORMAT: "image/png",
              CRS: crs,
            },
          }),
        }),
      ],
      view: new View({
        // FIXME: no hay soporte nativo para EPGS:22175. Por ahora la app se cae si se lo selecciona
        projection: crs,
        center: fromLonLat([-64.0, -34.0], CRS.EPSG_4326), // Coordenadas iniciales para Argentina
        zoom: 5,
      }),
    });

    // Limpiar el mapa cuando el componente se desmonte
    return () => map?.setTarget(undefined);
  }, [visibleLayers, crs]);

  return (
    <MapContext.Provider
      value={{
        layers,
        crs,
        setCRS,
        visibleLayers,
        setVisibleLayers,
        mapContainerRef,
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
