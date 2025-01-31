// reference (clerk onboarding): https://clerk.com/docs/references/nextjs/add-onboarding-flow

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/landing"]);
// TODO: add specific video URL to public routes
const isPublicRoute = createRouteMatcher(["/feed"]);

// Configure access to routes. Retrieve claims directly from the session and redirect user accordingly.
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // For users visiting /landing or feed (l;ogged in), don't redirect
  if (
    isOnboardingRoute(req) ||
    (sessionClaims?.metadata?.onboarded && isPublicRoute(req))
  ) {
    return NextResponse.next();
  }

  // redirect to landing page if no user
  if (!userId || !sessionClaims?.metadata?.onboarded) {
    const landingUrl = new URL("/landing", req.url);
    return NextResponse.redirect(landingUrl);
  }

  // If the user is logged in and has onboarded, let them view.
  if (userId) {
    const feedUrl = new URL("/feed", req.url);
    return NextResponse.redirect(feedUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
