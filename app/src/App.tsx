import "./App.css";
import { CSSProperties } from "react";
import "ol/ol.css";
import { useMap } from "@/hooks/useMap.tsx";
import AppSidebar from "@/components/AppSidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import AppControls from "@/components/AppControls.tsx";
import { Toaster } from "./components/ui/toaster";
import QueryDataMenu from "./components/QueryDataMenu";
import InsertDialog from "./components/InsertDialog";

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
          <AppControls />
          <QueryDataMenu />
        </SidebarInset>

        <InsertDialog />

        <Toaster />
      </SidebarProvider>
    </>
  );
}
