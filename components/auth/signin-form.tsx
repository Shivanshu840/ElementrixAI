"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Github } from "lucide-react"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the callback URL from search params or default to dashboard
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  // Prevent multiple simultaneous sign-in attempts
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        console.log("User already signed in, redirecting...")
        router.replace(callbackUrl)
      }
    }
    checkSession()
  }, [callbackUrl, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isSigningIn || isLoading) {
      console.log("Sign in already in progress, ignoring...")
      return
    }

    setIsLoading(true)
    setIsSigningIn(true)
    setError("")

    try {
      console.log("Attempting sign in with credentials...")

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Handle redirect manually to prevent loops
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        console.error("Sign in error:", result.error)
        setError("Invalid credentials")
      } else if (result?.ok) {
        console.log("Sign in successful")

        // Wait for session to be established
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts) {
          const session = await getSession()
          if (session) {
            console.log("Session established, redirecting to:", callbackUrl)
            router.replace(callbackUrl)
            return
          }
          attempts++
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        // Fallback if session check fails
        console.log("Session check timeout, redirecting anyway")
        router.replace(callbackUrl)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } catch (error) {
      console.error("Sign in exception:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
      setIsSigningIn(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    // Prevent multiple OAuth attempts
    if (isSigningIn || isLoading) {
      console.log("OAuth sign in already in progress, ignoring...")
      return
    }

    setIsLoading(true)
    setIsSigningIn(true)
    setError("")

    try {
      console.log(`Attempting ${provider} sign in...`)

      // Use redirect: false to prevent automatic redirects that might cause loops
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        console.error(`${provider} sign in error:`, result.error)
        setError(`Failed to sign in with ${provider}. Please try again.`)
        setIsLoading(false)
        setIsSigningIn(false)
      } else if (result?.url) {
        // Manually redirect to the callback URL
        console.log(`${provider} sign in initiated, redirecting to:`, result.url)
        window.location.href = result.url
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setIsLoading(false)
      setIsSigningIn(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || isSigningIn}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading || isSigningIn}
              onClick={() => handleOAuthSignIn("github")}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>

            <Button
              variant="outline"
              type="button"
              disabled={isLoading || isSigningIn}
              onClick={() => handleOAuthSignIn("google")}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
