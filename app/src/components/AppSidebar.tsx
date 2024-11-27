import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import LAYER_IDS from "@/capas";
import CrsSelector from "./CrsSelector";
import { ComponentProps } from "react";

export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <p className="font-semibold">Documentation</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <CrsSelector />
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {LAYER_IDS.map((layer_id) => (
              <SidebarMenuItem key={layer_id}>
                <SidebarMenuButton asChild>
                  <p>{layer_id}</p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
