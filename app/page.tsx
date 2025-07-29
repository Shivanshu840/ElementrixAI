import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Zap, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Elementrix AI</h1>
            <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
              <Sparkles className="h-3 w-3" />
              Powered by Gemini
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <h1 className="text-5xl font-bold text-gray-900">
            Generate React Components with <span className="text-purple-600">Gemini Flash</span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Build beautiful, functional React components through natural conversation. Our AI powered by Google's Gemini
          Flash understands your requirements and generates production-ready code instantly.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/auth/signup">
            <Button size="lg" className="px-8 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Building
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Component Generator?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Gemini Flash Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Powered by Google's latest Gemini Flash model for lightning-fast, high-quality component generation.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate components in seconds, not hours. Our AI understands your requirements instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Production Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get clean, maintainable code that follows best practices and modern React patterns.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Collaborative</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Save and share your component sessions. Resume work exactly where you left off.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-white/50 rounded-lg mx-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Describe Your Component</h3>
            <p className="text-gray-600">
              Simply tell our Gemini-powered AI what you want to build using natural language or upload an image
              reference.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gemini Generates Code</h3>
            <p className="text-gray-600">
              Our advanced Gemini Flash model creates React/TypeScript components with proper styling and functionality.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Preview & Export</h3>
            <p className="text-gray-600">
              See your component live, make iterative improvements, and export the final code.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Build Amazing Components?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of developers who are already using Gemini Flash to accelerate their React development.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="px-12 bg-purple-600 hover:bg-purple-700">
            <Sparkles className="h-5 w-5 mr-2" />
            Start Free Today
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="font-semibold">Component Generator</span>
              <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                <Sparkles className="h-3 w-3" />
                Powered by Gemini
              </div>
            </div>
            <p className="text-sm text-gray-600">© 2024 Component Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
