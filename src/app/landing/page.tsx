"use client";

import { useUser } from "@clerk/nextjs";

export default function Landing() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className="flex min-h-screen justify-center items-center fixed left-0 right-0 overflow-auto">
      <main className="flex flex-col gap-10 items-center mb-10 max-h-screen">
        {user ? <h1>Onboarding</h1> : <h1>Random Feed</h1>}
      </main>
    </div>
  );
}
