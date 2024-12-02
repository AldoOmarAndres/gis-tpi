import { Button } from "@/components/ui/button";
import useMapZoom from "@/hooks/useMapZoom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  MapPinPlusIcon,
  MousePointerClick,
  RulerIcon,
  Trash2Icon,
} from "lucide-react";
import { Operation, useMap } from "@/hooks/useMap";
import {
  useMeasureAreaInteraction,
  useMeasureLineInteraction,
} from "@/hooks/useMeasureInteraction";

function ZoomControls() {
  const { zoomTo } = useMapZoom();

  return (
    <div className="flex flex-col justify-center bg-sidebar rounded-lg w-min">
      <Button
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className="h-8 text-xl hover:bg-slate-200"
        onClick={() => zoomTo(+1)}
        title="Zoom in"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <span className="sr-only">Zoom In</span>
      </Button>
      <Button
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className="h-8 text-xl hover:bg-slate-200"
        onClick={() => zoomTo(-1)}
        title="Zoom out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
        <span className="sr-only">Zoom Out</span>
      </Button>
    </div>
  );
}

function HandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-8 w-8 text-xl hover:bg-slate-200"
    >
      <path d="M256 0c-25.3 0-47.2 14.7-57.6 36c-7-2.6-14.5-4-22.4-4c-35.3 0-64 28.7-64 64l0 165.5-2.7-2.7c-25-25-65.5-25-90.5 0s-25 65.5 0 90.5L106.5 437c48 48 113.1 75 181 75l8.5 0 8 0c1.5 0 3-.1 4.5-.4c91.7-6.2 165-79.4 171.1-171.1c.3-1.5 .4-3 .4-4.5l0-176c0-35.3-28.7-64-64-64c-5.5 0-10.9 .7-16 2l0-2c0-35.3-28.7-64-64-64c-7.9 0-15.4 1.4-22.4 4C303.2 14.7 281.3 0 256 0zM240 96.1l0-.1 0-32c0-8.8 7.2-16 16-16s16 7.2 16 16l0 31.9 0 .1 0 136c0 13.3 10.7 24 24 24s24-10.7 24-24l0-136c0 0 0 0 0-.1c0-8.8 7.2-16 16-16s16 7.2 16 16l0 55.9c0 0 0 .1 0 .1l0 80c0 13.3 10.7 24 24 24s24-10.7 24-24l0-71.9c0 0 0-.1 0-.1c0-8.8 7.2-16 16-16s16 7.2 16 16l0 172.9c-.1 .6-.1 1.3-.2 1.9c-3.4 69.7-59.3 125.6-129 129c-.6 0-1.3 .1-1.9 .2l-4.9 0-8.5 0c-55.2 0-108.1-21.9-147.1-60.9L52.7 315.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L119 336.4c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2L160 96c0-8.8 7.2-16 16-16c8.8 0 16 7.1 16 15.9L192 232c0 13.3 10.7 24 24 24s24-10.7 24-24l0-135.9z" />
    </svg>
  );
}

function AreaRulerIcon() {
  return (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 7H7m2 3H7m2 3H7m4 2v2m3-2v2m3-2v2M4 5v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-9a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1Z"
      />
    </svg>
  );
}

function OperationsMenu() {
  const { map, activeOperation, changeOperation } = useMap();
  const { measureLineLayer } = useMeasureLineInteraction();
  const { measureAreaLayer } = useMeasureAreaInteraction();

  const measureLineSource = measureLineLayer.getSource();
  const measureAreaSource = measureAreaLayer.getSource();

  /** Elimina los dibujos asociados a la medición de distancias y áreas. */
  function clearDrawings() {
    map.getOverlays().clear();
    measureLineSource?.clear();
    measureAreaSource?.clear();
  }

  const shouldDisplayDeleteButton =
    activeOperation === "measure-line" ||
    activeOperation === "measure-area" ||
    measureLineSource?.getFeatures().length !== 0 ||
    measureAreaSource?.getFeatures().length !== 0;
  return (
    <div className="flex gap-1">
      <ToggleGroup
        type="single"
        defaultValue="navigate"
        value={activeOperation}
        // Controlar el componente para asegurar que siempre tenga un valor seleccionado
        onValueChange={(value) => value && changeOperation(value as Operation)}
        className="flex flex-col gap-0 justify-center bg-sidebar rounded-lg"
      >
        <ToggleGroupItem
          value="navigate"
          aria-label="Alternar navegación"
          title="Navegación"
          className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-slate-300 data-[state=on]:border-slate-500 data-[state=on]:border-2"
        >
          <HandIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="measure-line"
          aria-label="Alternar medición de distancias"
          title="Medición de distancias"
          className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-slate-300 data-[state=on]:border-slate-500 data-[state=on]:border-2"
        >
          <RulerIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="measure-area"
          aria-label="Alternar medición de áreas"
          title="Medición de áreas"
          className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-slate-300 data-[state=on]:border-slate-500 data-[state=on]:border-2"
        >
          <AreaRulerIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="query"
          aria-label="Alternar consulta gráfica"
          title="Consulta gráfica"
          className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-slate-300 data-[state=on]:border-slate-500 data-[state=on]:border-2"
        >
          <MousePointerClick />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="insert"
          aria-label="Insertar nuevo lugar gastronómico"
          title="Insertar nuevo lugar gastronómico"
          className="h-8 w-8 hover:bg-slate-200 data-[state=on]:bg-slate-300 data-[state=on]:border-slate-500 data-[state=on]:border-2"
        >
          <MapPinPlusIcon />
        </ToggleGroupItem>
      </ToggleGroup>

      {shouldDisplayDeleteButton && (
        <Button
          aria-label="Eliminar mediciones"
          title="Eliminar mediciones"
          className="h-8 w-8 relative top-12 border-red-400 bg-red-200 hover:bg-red-300 border-2"
          onClick={() => clearDrawings()}
          size="icon"
          variant="outline"
        >
          <Trash2Icon />
        </Button>
      )}
    </div>
  );
}

export default function AppControls() {
  return (
    <div className="absolute m-2 flex flex-col justify-start gap-2">
      <div className="bg-sidebar rounded-lg w-min">
        <SidebarTrigger
          className="h-8 w-9 hover:bg-slate-200"
          title="Alternar sidebar"
        />
      </div>

      <ZoomControls />

      <OperationsMenu />
    </div>
  );
}
