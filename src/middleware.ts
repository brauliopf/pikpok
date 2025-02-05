// reference (clerk onboarding): https://clerk.com/docs/references/nextjs/add-onboarding-flow

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isWebhookRoute = createRouteMatcher(["/api/users/webhooks(.*)"]);

const isPublicRoute = createRouteMatcher(["/landing"]);
// TODO: add specific video URL to public routes
const isFeedRoute = createRouteMatcher(["/feed"]);

// Configure access to routes. Retrieve claims directly from the session and redirect user accordingly.
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // let webhooks pass
  if (isWebhookRoute(req)) return NextResponse.next();

  // Not logged in. Redirect to landing page. If landing, be there.
  if (!userId) {
    if (!isPublicRoute(req)) {
      const landingUrl = new URL("/landing", req.url);
      return NextResponse.redirect(landingUrl);
    } else {
      return NextResponse.next();
    }
  }

  // Logged in. If not onboarded, go to onboarding (and be there). If onboarded, route to feed.
  if (userId) {
    if (!sessionClaims?.metadata?.onboarded) {
      if (req.nextUrl.pathname == "/onboarding") {
        return NextResponse.next();
      } else {
        const onboardingUrl = new URL("/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    } else if (!isFeedRoute(req)) {
      const feedUrl = new URL("/feed", req.url);
      return NextResponse.redirect(feedUrl);
    } else {
      return NextResponse.next();
    }
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
