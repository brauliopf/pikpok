"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// Reference: https://ui.shadcn.com/docs/components/sidebar
import { LogIn, Home } from "lucide-react"; // https://lucide.dev/icons/
import VideoUploadForm from "./VideoUploadForm";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function AppSidebar() {
  return (
    <Sidebar className="w-50">
      <SidebarContent>
        <SidebarGroup>
          <h2 className="bold">PicPoc</h2>
          <hr className="my-4 border-t border-gray-200 w-full" />
        </SidebarGroup>
        <SidebarGroup>
          <SignedOut>
            <SignInButton>
              <SidebarMenuButton asChild>
                <a href="#" className="flex justify-center hover:bg-zinc-200">
                  <LogIn />
                </a>
              </SidebarMenuButton>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex justify-center hover:none">
              <UserButton />
            </div>
          </SignedIn>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton asChild>
                <a href="#" className="flex justify-center hover:bg-zinc-200">
                  <Home />
                </a>
              </SidebarMenuButton>
              <VideoUploadForm />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
