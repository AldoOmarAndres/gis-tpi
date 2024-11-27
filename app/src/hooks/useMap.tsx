import { CRS } from "@/models";
import { useContext, createContext, useState, useMemo } from "react";

interface IMapContext {
  /** Sistema de Referencia de Coordenadas actual. */
  crs: CRS | string;
  /** Setter de `crs`. */
  setCRS: (crs: CRS | string) => void;
}

interface MapProviderProps {
  children?: React.ReactNode;
}

const MapContext = createContext<IMapContext | undefined>(undefined);

export function MapProvider({ children }: MapProviderProps) {
  const [crs, updateCrs] = useState<CRS | string>(CRS.EPSG_4326);

  const setCRS = useMemo(() => (crs: CRS | string) => updateCrs(crs), []);

  return (
    <MapContext.Provider value={{ crs, setCRS }}>
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
