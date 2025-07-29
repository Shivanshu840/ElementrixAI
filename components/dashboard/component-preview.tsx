"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, ExternalLink, Maximize2, Minimize2, Sparkles, Monitor, Smartphone, Tablet } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { LiveProvider, LiveError, LivePreview } from "react-live"
import { themes } from "prism-react-renderer"

// Import common React components that might be used in generated code
const scope = {
  useState: React.useState,
  useEffect: React.useEffect,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useRef: React.useRef,
}

export function ComponentPreview() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { currentSession } = useAppStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeComponent =
    currentSession?.components?.find((c) => c.id === currentSession.activeComponentId) ||
    currentSession?.components?.[currentSession?.components.length - 1]

  const refreshPreview = () => {
    setIsLoading(true)
    // Simulate refresh delay
    setTimeout(() => setIsLoading(false), 500)
  }

  const openInNewTab = () => {
    if (activeComponent) {
      const newWindow = window.open("", "_blank")
      if (newWindow) {
        newWindow.document.write(createStandaloneHTML())
        newWindow.document.close()
      }
    }
  }

  const createStandaloneHTML = () => {
    if (!activeComponent) return ""

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${activeComponent.name} - Component Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 800px;
            width: 100%;
        }
        ${activeComponent.cssCode || ""}
    </style>
</head>
<body>
    <div class="container">
        <div id="root"></div>
    </div>
    <script type="text/babel">
        ${activeComponent.jsxCode}
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(Component));
    </script>
</body>
</html>`
  }

  const getViewportClass = () => {
    switch (viewportSize) {
      case "mobile":
        return "max-w-sm mx-auto"
      case "tablet":
        return "max-w-2xl mx-auto"
      default:
        return "w-full"
    }
  }

  const cleanComponentCode = (code: string) => {
    // Remove imports and exports for live preview
    let cleaned = code
      .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, "")
      .replace(/export\s+default\s+/g, "")
      .replace(/export\s+/g, "")

    // Ensure the component is properly formatted for react-live
    if (!cleaned.includes("function ") && !cleaned.includes("const ") && !cleaned.includes("=>")) {
      cleaned = `function Component() {\n  return (\n    ${cleaned}\n  )\n}`
    }

    return cleaned
  }

  if (!isMounted) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Component Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activeComponent) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Component Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <Monitor className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Component Selected</h3>
              <p className="text-sm">Generate a component in the chat to see a live preview here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {activeComponent.name}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Size Controls */}
            <div className="flex items-center gap-1 mr-2">
              <Button
                variant={viewportSize === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("desktop")}
                className="h-8 w-8 p-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("tablet")}
                className="h-8 w-8 p-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("mobile")}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" onClick={refreshPreview} disabled={isLoading} className="h-8 w-8 p-0">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>

            <Button variant="ghost" size="sm" onClick={openInNewTab} className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 w-8 p-0">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full">
          <LiveProvider code={cleanComponentCode(activeComponent.jsxCode)} scope={scope} theme={themes.github}>
            <div className="h-full flex flex-col">
              {/* Error Display */}
              <LiveError className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm font-mono" />

              {/* Preview Area */}
              <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
                <div className={`transition-all duration-300 ${getViewportClass()}`}>
                  <div className="bg-white rounded-lg shadow-lg p-6 min-h-[200px] flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Refreshing preview...</span>
                      </div>
                    ) : (
                      <LivePreview className="w-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </LiveProvider>
        </div>
      </CardContent>

      {/* Custom CSS Injection */}
      {activeComponent.cssCode && <style dangerouslySetInnerHTML={{ __html: activeComponent.cssCode }} />}
    </Card>
  )
}
