// reference (clerk onboarding): https://clerk.com/docs/references/nextjs/add-onboarding-flow

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isLandingRoute = createRouteMatcher(["/landing", "/api/webhooks(.*)"]);
// TODO: add specific video URL to public routes
const isFeedRoute = createRouteMatcher(["/feed"]);

// Configure access to routes. Retrieve claims directly from the session and redirect user accordingly.
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (userId) {
    if (!sessionClaims?.metadata?.onboarded) {
      if (!isLandingRoute(req)) {
        const landingUrl = new URL("/landing", req.url);
        return NextResponse.redirect(landingUrl);
      } else {
        return NextResponse.next();
      }
    } else {
      return NextResponse.next();
    }
  }

  if (!userId && isLandingRoute(req)) {
    return NextResponse.next();
  } else if (!userId && !isLandingRoute(req)) {
    const landingUrl = new URL("/landing", req.url);
    return NextResponse.redirect(landingUrl);
  }

  // For logged-in users visiting /landing or /feed, don't redirect
  if (
    isLandingRoute(req) ||
    (sessionClaims?.metadata?.onboarded && isFeedRoute(req))
  ) {
    return NextResponse.next();
  }

  // redirect to landing page if no user or not onboarded
  if (!userId || !sessionClaims?.metadata?.onboarded) {
    const landingUrl = new URL("/landing", req.url);
    return NextResponse.redirect(landingUrl);
  }

  // finally
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
