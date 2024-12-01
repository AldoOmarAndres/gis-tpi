import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import { useMap } from "@/hooks/useMap";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { layers, activeLayerId, setActiveLayerId } = useMap();

  /** Alternar la visibilidad de la capa con ID `layerId`. */
  function toggleVisibility(layerId: string) {
    const layer = layers.find((l) => l.get("id") === layerId);

    if (!layer) {
      return;
    }

    layer.setVisible(!layer.isVisible());
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <p className="font-semibold">🌎 SIG - Grupo 4 - UTN FRRe - 2024</p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

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
                    onClick={() => setActiveLayerId(layer.get("id"))}
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

      <SidebarSeparator />

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
