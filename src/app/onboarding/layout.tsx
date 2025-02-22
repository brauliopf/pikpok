import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function rootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if a user has completed onboarding
  // If yes, redirect them to /dashboard
  if ((await auth()).sessionClaims?.metadata?.onboarded === true) {
    redirect("/feed");
  }

  return <>{children}</>;
}
