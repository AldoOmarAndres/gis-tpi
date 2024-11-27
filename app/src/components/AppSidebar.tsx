import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CrsSelector from "./CrsSelector";
import { ComponentProps } from "react";
import { useMap } from "@/hooks/useMap";
import { Checkbox } from "@/components/ui/checkbox";

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
    <Sidebar variant="floating" {...props}>
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
                    ? "underline font-bold bg-stone-300 hover:bg-stone-300 active:bg-stone-300"
                    : "font-medium"
                }
              >
                <div className="flex gap-0">
                  <Checkbox
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
            <CrsSelector />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
