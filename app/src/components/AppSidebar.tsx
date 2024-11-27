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
  const { layers } = useMap();

  /** Alternar la visibilidad de la capa `selectedLayer`. */
  function toggleLayerVisibility(selectedLayer: string) {
    const layer = layers.find((l) => l.get("id") === selectedLayer);

    if (!layer) {
      return;
    }

    layer.setVisible(!layer.isVisible());
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
            <SidebarMenuItem key={layer.get("id")}>
              <SidebarMenuButton asChild>
                <div className="flex space-x-2">
                  <Checkbox
                    id={layer.get("id")}
                    onCheckedChange={() =>
                      toggleLayerVisibility(layer.get("id"))
                    }
                  />
                  <label
                    htmlFor={layer.get("id")}
                    className="text-sm font-medium leading-none w-full peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {layer.get("name")}
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
