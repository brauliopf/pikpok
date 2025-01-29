"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { SidebarGroup } from "@/components/ui/sidebar";

export default function UserSignup() {
  return (
    <SidebarGroup id="signin">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div className="flex justify-between">
          <UserButton />
          <SignOutButton />
        </div>
      </SignedIn>
    </SidebarGroup>
  );
}
