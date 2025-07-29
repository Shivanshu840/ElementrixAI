import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Add debugging in development
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware triggered for:", pathname)
      console.log("Has token:", !!req.nextauth.token)
    }

    // Allow the request to continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Add debugging
        if (process.env.NODE_ENV === "development") {
          console.log("Checking authorization for:", pathname)
          console.log("Token exists:", !!token)
        }

        // Always allow access to auth pages and API auth routes
        if (pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) {
          return true
        }

        // For protected routes, require a valid token
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/api/sessions") ||
          pathname.startsWith("/api/chat")
        ) {
          return !!token
        }

        // Allow all other routes
        return true
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  },
)

// Simplified and more specific matcher
export const config = {
  matcher: [
    // Only protect specific routes that need authentication
    "/dashboard/:path*",
    "/api/sessions/:path*",
    "/api/chat/:path*",
  ],
}
