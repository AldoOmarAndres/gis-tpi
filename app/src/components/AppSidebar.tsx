import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import { useMap } from "@/hooks/useMap";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { layers, activeLayer, setActiveLayer } = useMap();
  const activeLayerId = activeLayer?.get("id");

  /** Alternar la visibilidad de la capa con ID `layer_id`. */
  function toggleVisibility(layer_id: string) {
    const layer = layers.find((l) => l.get("id") === layer_id);

    if (!layer) {
      return;
    }

    layer.setVisible(!layer.isVisible());
  }

  /** Activa la capa con ID `layer_id`. Será la capa activa hasta que se active otra. */
  function activateLayer(layer_id: string) {
    const layer = layers.find((l) => l.get("id") === layer_id);
    setActiveLayer(layer);
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <p className="font-semibold">
                🌎 SIG - Grupo 4 - UTN FRRe - 2024
              </p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-0">
          {layers.map((layer) => (
            <SidebarMenuItem key={layer.get("id")}>
              <SidebarMenuButton
                asChild
                className={
                  layer.get("id") === activeLayerId
                    ? "underline font-bold bg-slate-300 hover:bg-slate-300 active:bg-slate-300"
                    : "font-medium"
                }
              >
                <div className="flex gap-0 pl-4">
                  <Checkbox
                    // FIXME: en mobile, abrir y cerrar el sidebar deschequea el checkbox
                    id={layer.get("id")}
                    onCheckedChange={() => toggleVisibility(layer.get("id"))}
                    className="h-5 w-5"
                  />
                  <p
                    onClick={() => activateLayer(layer.get("id"))}
                    className="w-full m-0 p-2"
                  >
                    {layer.get("name")}
                  </p>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="outline"
              className="cursor-default pointer-events-none"
              title="Sistema de Referencia de Coordenadas"
            >
              EPSG:4326 - WGS 84
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
