"use client";

import { useUser } from "@clerk/nextjs";
import Feed from "@/components/feed";

export default function Landing() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className="flex flex-1 left-0 right-0 top-0 bottom-0 h-screen overflow-y-auto">
      <main className="flex flex-1 flex-row gap-20 items-center mx-auto">
        <div className="w-2/5 ml-20">
          <span>TikTok-style welcome page.</span>
          <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
          </ul>
        </div>
        <div className="h-screen">
          <Feed />
        </div>
      </main>
    </div>
  );
}
