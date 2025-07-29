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

        // CRITICAL: Always allow NextAuth routes to prevent infinite loops
        if (pathname.startsWith("/api/auth/")) {
          return true
        }

        // Always allow access to auth pages
        if (pathname.startsWith("/auth/")) {
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

// CRITICAL: Exclude ALL NextAuth routes from middleware
export const config = {
  matcher: [
    // Only protect specific routes, EXCLUDE NextAuth routes
    "/dashboard/:path*",
    "/api/sessions/:path*",
    "/api/chat/:path*",
    // Explicitly exclude NextAuth API routes
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
