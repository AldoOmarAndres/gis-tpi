import { useMap } from "@/hooks/useMap";
import { TileWMS } from "ol/source";
import { useState, useEffect } from "react";

export function LegendList() {
    const { layers, map } = useMap();
  
    const [legendUrl, setLegendUrl] = useState<(string | undefined)[]>([]);
    let layer = layers.filter((l) => l.getVisible());
    console.log(layer)
  
    useEffect(() => {
      if (!map) return;
  
  
      if (!layer) {
        setLegendUrl([]);
        return;
      }
  
      const source = layer.map(l => l.getSource() as TileWMS)
      const resolution = map.getView().getResolution();
      const graphicUrl = source.map( s => s.getLegendUrl(resolution || undefined))
  
      setLegendUrl(graphicUrl || null);
    }, [layers, map, layer.length]);
  
    if (layer.length === 0) {
      return (
        <p>
            No hay capas activas
        </p>
      )
    }
  
    return (
      <div className="legend-container p-4 bg-white shadow-lg rounded-md">
        <h3 className="font-semibold mb-2">Leyenda</h3>
        {legendUrl.map( l => {
        return <img src={l} alt="Leyenda de la capa activa" />
        })}
      </div>
    );
  }
  