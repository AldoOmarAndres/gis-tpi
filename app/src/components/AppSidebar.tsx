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
  const { layers, setVisibleLayers } = useMap();

  // Manejar cambios de visibilidad de capas
  function toggleLayerVisibility(selectedLayer: string) {
    const layer = layers.find((c) => c.id === selectedLayer);

    if (!layer) {
      return;
    }

    layer.isVisible = !layer.isVisible;

    if (layer.isVisible) {
      // Mostrar la capa
      setVisibleLayers((prev: string[]) => [...prev, layer.id]);
    } else {
      // Ocultar la capa
      setVisibleLayers((prev) => prev.filter((c) => c !== layer.id));
    }
  }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <p className="font-semibold">
                🌎 SIG - Grupo 4 - UTN FRRe - 2024{" "}
              </p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-2">
          {layers.map((layer) => (
            <SidebarMenuItem key={layer.id}>
              <SidebarMenuButton asChild>
                <div className="flex space-x-2">
                  <Checkbox
                    id={layer.id}
                    onCheckedChange={() => toggleLayerVisibility(layer.id)}
                  />
                  <label
                    htmlFor={layer.id}
                    className="text-sm font-medium leading-none w-full peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {layer.name}
                  </label>
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
