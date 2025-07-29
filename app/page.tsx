"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Zap, Users, Sparkles, ArrowRight, Play, CheckCircle, Star, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Sparkles, title: "AI-Powered", color: "text-purple-500" },
    { icon: Zap, title: "Lightning Fast", color: "text-yellow-500" },
    { icon: Code, title: "Production Ready", color: "text-blue-500" },
    { icon: Users, title: "Collaborative", color: "text-green-500" },
  ]

  const workflowSteps = [
    {
      step: "1",
      title: "Describe Your Component",
      description: "Simply tell our AI what you want to build using natural language or upload an image reference.",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      step: "2",
      title: "AI Generates Code",
      description:
        "Our advanced ElementrixAI creates React/TypeScript components with proper styling and functionality.",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      step: "3",
      title: "Preview & Export",
      description: "See your component live, make iterative improvements, and export the final code.",
      icon: Eye,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ElementrixAI
              </h1>
              <Badge variant="secondary" className="text-xs mt-1">
                Next-Gen AI Platform
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="hover:bg-purple-50 transition-colors">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-purple-500 animate-spin-slow" />
              <div className="absolute inset-0 h-12 w-12 text-purple-300 animate-ping">
                <Sparkles className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-6xl font-bold">
              <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
                Generate React Components with{" "}
              </span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                ElementrixAI
              </span>
            </h1>
          </div>

          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Build beautiful, functional React components through natural conversation. Our advanced AI understands your
            requirements and generates production-ready code instantly with intelligent design patterns.
          </p>

          <div className="flex items-center justify-center space-x-6 mb-12">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                Start Building Free
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-lg bg-transparent"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Components Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-gray-600">Happy Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Why Choose ElementrixAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of React development with our cutting-edge AI platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm ${
                currentFeature === index ? "ring-2 ring-purple-500 shadow-purple-200" : ""
              }`}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 relative">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  {currentFeature === index && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 animate-pulse"></div>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {index === 0 &&
                    "Powered by advanced AI algorithms for intelligent component generation with smart design patterns."}
                  {index === 1 &&
                    "Generate components in seconds, not hours. Our AI understands your requirements instantly."}
                  {index === 2 && "Get clean, maintainable code that follows best practices and modern React patterns."}
                  {index === 3 && "Save and share your component sessions. Resume work exactly where you left off."}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            How ElementrixAI Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {workflowSteps.map((item, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Connecting Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} transform origin-left transition-all duration-700 ${
                        hoveredStep === index ? "scale-x-100" : "scale-x-0"
                      }`}
                    ></div>
                  </div>
                )}

                <Card
                  className={`relative z-10 h-full border-0 shadow-lg transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl bg-gradient-to-br ${item.bgColor} overflow-hidden`}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} transform rotate-12 scale-150 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-200`}
                    ></div>
                  </div>

                  <CardHeader className="text-center pb-4 relative z-10">
                    <div className="mx-auto mb-6 relative">
                      {/* Main Icon Container */}
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12`}
                      >
                        <item.icon className="h-10 w-10 text-white transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 group-hover:border-purple-200 transition-all duration-300">
                        <span
                          className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                        >
                          {item.step}
                        </span>
                      </div>

                      {/* Floating Particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-60 transition-all duration-700 animate-float`}
                            style={{
                              left: `${20 + i * 30}%`,
                              top: `${10 + i * 20}%`,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <CardTitle
                      className={`text-2xl font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:${item.color} group-hover:bg-clip-text group-hover:text-transparent`}
                    >
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-center relative z-10">
                    <CardDescription className="text-gray-700 leading-relaxed text-base group-hover:text-gray-800 transition-colors duration-300">
                      {item.description}
                    </CardDescription>

                    {/* Progress Bar */}
                    <div className="mt-6 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} transform origin-left transition-all duration-700 ${
                          hoveredStep === index ? "scale-x-100" : "scale-x-0"
                        }`}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-current animate-pulse" />
            ))}
          </div>
          <h3 className="text-2xl font-bold mb-4">Trusted by developers worldwide</h3>
          <p className="text-gray-600">Join thousands of developers who are already using ElementrixAI</p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Amazing Components?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who are already using ElementrixAI to accelerate their React development.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-12 py-4 bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg font-semibold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Free Today
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <CheckCircle className="h-4 w-4" />
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ElementrixAI
                </span>
                <Badge variant="outline" className="ml-2 text-xs">
                  AI Platform
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600">© 2024 ElementrixAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
