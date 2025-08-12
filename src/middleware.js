import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/select-role",
  "/api/test-db",
  "/api/auth/check"
];

// Define ignored routes
const ignoredRoutes = [
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/_next",
  "/favicon.ico",
  "/assets"
];

export default clerkMiddleware({
  publicRoutes,
  ignoredRoutes,
  afterAuth(auth, req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const userRole = auth.user?.publicMetadata?.role;

    console.log('Middleware Debug:', {
      path,
      userId: auth.userId,
      sessionId: auth.sessionId,
      isPublicRoute: publicRoutes.some(route => {
        if (route.includes('*')) {
          return new RegExp(route.replace('*', '.*')).test(path);
        }
        return route === path;
      })
    });

    // Pass Clerk auth headers for all API routes (not just /api/auth/check)
    if (path.startsWith("/api/")) {
      const response = NextResponse.next();
      ['authorization', 'cookie', 'clerk-session'].forEach(header => {
        const value = req.headers.get(header);
        if (value) response.headers.set(header, value);
      });
      return response;
    }

    const isPublicRoute = publicRoutes.some(route => {
      if (route.includes('*')) {
        return new RegExp(route.replace('*', '.*')).test(path);
      }
      return route === path;
    });

    if (!auth.userId && !isPublicRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (auth.userId && !userRole && !path.startsWith("/select-role")) {
      return NextResponse.redirect(new URL("/select-role", req.url));
    }

    // Prevent logged-in users from visiting auth pages or select-role when already has role
    if (
      auth.userId &&
      userRole &&
      (path === "/sign-in" || path === "/sign-up" || path === "/select-role")
    ) {
      const dashboardUrl =
        userRole === "owner" ? "/dashboard/owner" : "/dashboard/contributor";
      if (!path.startsWith(dashboardUrl)) {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
    }

    // Guard dashboard URLs by role
    if (auth.userId && userRole) {
      if (path.startsWith("/dashboard/owner") && userRole !== "owner") {
        return NextResponse.redirect(new URL("/dashboard/contributor", req.url));
      }
      if (path.startsWith("/dashboard/contributor") && userRole !== "contributor") {
        return NextResponse.redirect(new URL("/dashboard/owner", req.url));
      }
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
