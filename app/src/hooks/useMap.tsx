import { useContext, createContext, useState, useMemo } from "react";

export interface MapFiltros {
  /** id de la cancha a reservar. */
  idCancha?: number;
  /** id del establecimiento a reservar. */
  idEst?: number;
  /** Busca disponibilidades que sean de esa disciplina. */
  disciplina?: string;
  /** Busca disponibilidades todavía no reservadas en esa fecha. */
  fecha?: string;
  /** Busca disponibilidades en esa provincia. */
  provincia?: string;
  /** Busca disponibilidades en esa localidad. Requiere un valor en `provincia`. */
  localidad?: string;
  /** Busca disponibilidades de canchas habilitadas (o deshabilitadas). */
  habilitada?: boolean;
}

interface IMapContext {
  /** Filtros de búsqueda. */
  filtros: MapFiltros;
  /** Sobreescribe todos los filtros. */
  updateFiltros: React.Dispatch<React.SetStateAction<MapFiltros>>;
  /** Actualiza un solo filtro. */
  setFiltro: (filtro: keyof MapFiltros, valor: string | number) => void;
}

interface MapProviderProps {
  children?: React.ReactNode;
}

const MapContext = createContext<IMapContext | undefined>(undefined);

export function MapProvider({ children }: MapProviderProps) {
  const [filtros, updateFiltros] = useState<MapFiltros>({});

  const setFiltro = useMemo(
    () => (filtro: keyof MapFiltros, valor?: string | number) => {
      updateFiltros((prev) => ({ ...prev, [filtro]: valor }));
    },
    []
  );

  return (
    <MapContext.Provider value={{ filtros, updateFiltros, setFiltro }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("Usar context dentro de un MapProvider");
  }
  return context;
}
