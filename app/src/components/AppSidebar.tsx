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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeOff } from "lucide-react";
import { TileWMS } from "ol/source";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function LegendsList() {
  const { layers, map } = useMap();
  const visibleLayers = layers.filter((l) => l.getVisible());
  const sources = visibleLayers.map((l) => l.getSource() as TileWMS);
  const resolution = map.getView().getResolution();
  const urls = sources.map((s) => s.getLegendUrl(resolution));

  if (visibleLayers.length === 0) {
    return (
      <SidebarMenuItem>
        <Alert className="m-2 w-auto">
          <EyeOff className="h-5 w-5" />
          <AlertTitle>¡No hay capas visibles!</AlertTitle>
          <AlertDescription>
            Aquí podrás ver la leyenda de cada capa que esté visible.
          </AlertDescription>
        </Alert>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <div className="m-3 pb-2 bg-white shadow-lg rounded-md">
        {urls.map((url) => (
          <img key={url} src={url} alt="Leyenda de la capa" />
        ))}
      </div>
    </SidebarMenuItem>
  );
}

function LayersList() {
  const { layers, activeLayerId, setActiveLayerId } = useMap();

  return (
    <>
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
                id={layer.get("id")}
                defaultChecked={layer.isVisible()}
                // Toggle the layer visibility
                onCheckedChange={() => layer.setVisible(!layer.isVisible())}
                className="h-5 w-5 data-[state=checked]:bg-slate-700"
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
    </>
  );
}
export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="font-semibold">
            🌎 SIG - Grupo 4 - UTN FRRe - 2024
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu className="gap-0">
          <Tabs defaultValue="layers">
            <TabsList className="w-full">
              <TabsTrigger value="layers" className="min-w-[40%]">
                Capas
              </TabsTrigger>
              <TabsTrigger value="legends" className="min-w-[40%]">
                Leyendas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layers">
              <LayersList />
            </TabsContent>
            <TabsContent value="legends">
              <LegendsList />
            </TabsContent>
          </Tabs>
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
