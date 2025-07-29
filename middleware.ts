import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add debugging in development
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware triggered for:", req.nextUrl.pathname)
      console.log("Has token:", !!req.nextauth.token)
    }

    // Allow the request to continue if authorized
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

export const config = {
  matcher: [
    // Protect these specific routes
    "/dashboard/:path*",
    "/api/sessions/:path*",
    "/api/chat/:path*",
    // Don't run middleware on these paths
    "/((?!_next/static|_next/image|favicon.ico|auth/signin|auth/signup|auth/error).*)",
  ],
}
