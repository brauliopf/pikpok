"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, Mouse } from "lucide-react";

export default function UserSignup() {
  return (
    <Dialog>
      <DialogTrigger>
        <SidebarMenuItem key="dialog">
          <SidebarMenuButton asChild>
            <a href="#">
              <Mouse />
              <span>Display Dialog</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
