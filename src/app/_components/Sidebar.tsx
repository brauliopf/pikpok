"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
// Reference: https://ui.shadcn.com/docs/components/sidebar
import VideoUploadForm from "./VideoUploadForm";

export default function AppSidebar() {
  return (
    <Sidebar className="w-50">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pic Poc</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <VideoUploadForm />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
