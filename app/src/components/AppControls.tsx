import { Button } from "@/components/ui/button";
import useMapZoom from "@/hooks/useMapZoom";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "./ui/sidebar";

export default function AppControls() {
  const { zoomTo } = useMapZoom();

  return (
    <div className="absolute m-2 p-1 flex flex-col justify-center gap-1 bg-sidebar rounded-md">
      <SidebarTrigger
        className={cn("h-8 w-8 hover:bg-stone-200 m-auto")}
        title="Toggle Sidebar"
      />
      <Button
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8 text-xl hover:bg-stone-200 m-auto")}
        onClick={() => zoomTo(+1)}
        title="Zoom In"
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
        className={cn("h-8 w-8 text-xl hover:bg-stone-200 m-auto")}
        onClick={() => zoomTo(-1)}
        title="Zoom Out"
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
