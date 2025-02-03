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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Home, LogIn, CloudUpload } from "lucide-react"; // https://lucide.dev/icons/
import VideoUploadForm from "./video-upload-form";

export default function AppSidebar() {
  return (
    <Sidebar className="w-50">
      <SidebarContent>
        <SidebarGroup>
          <h2 className="bold">PicPoc</h2>
          <hr className="my-4 border-t border-gray-200 w-full" />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SignedOut>
                  <SignInButton>
                    <SidebarMenuButton asChild>
                      <a
                        href="#"
                        className="flex justify-center hover:bg-zinc-200 px-2"
                      >
                        <LogIn />
                      </a>
                    </SidebarMenuButton>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <SidebarMenuButton>
                    <ul className="flex justify-center hover:none px-2">
                      <UserButton />
                    </ul>
                  </SidebarMenuButton>
                </SignedIn>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex justify-center hover:bg-zinc-200">
                    <Home />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Dialog>
                <DialogTrigger>
                  <SidebarMenuItem key="dialog">
                    <SidebarMenuButton asChild>
                      <a
                        href="#"
                        className="flex justify-center hover:bg-zinc-200"
                      >
                        <CloudUpload />
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </DialogTrigger>
                <VideoUploadForm />
              </Dialog>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
