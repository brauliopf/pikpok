"use client";

import { useUser } from "@clerk/nextjs";
import Feed from "@/components/feed";

export default function Landing() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className="flex min-h-screen justify-center items-center fixed left-0 right-0">
      <main className="flex flex-row gap-10 items-center mb-10 max-h-screen">
        <div className="w-400">
          <span>TikTok-style welcome page</span>
        </div>
        <div className="overflow-auto p-10">
          <Feed />
        </div>
      </main>
    </div>
  );
}
