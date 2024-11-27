import "./App.css";
import { CSSProperties } from "react";
import "ol/ol.css";
import { useMap } from "./hooks/useMap.tsx";
import AppSidebar from "./components/AppSidebar.tsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar.tsx";

export default function App() {
  const { mapContainerRef } = useMap();

  return (
    <>
      <SidebarProvider style={{ "--sidebar-width": "19rem" } as CSSProperties}>
        <AppSidebar />
        <SidebarInset>
          {/* Contenedor del mapa */}
          <div
            id="map"
            ref={mapContainerRef}
            style={{ width: "100%", height: "100vh" }}
          ></div>
          <SidebarTrigger className="absolute ml-2 mt-3" />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
