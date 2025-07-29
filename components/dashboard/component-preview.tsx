"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Maximize2, Minimize2, Sparkles, Monitor, Smartphone, Tablet } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function ComponentPreview() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { currentSession } = useAppStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeComponent =
    currentSession?.components?.find((c) => c.id === currentSession.activeComponentId) ||
    currentSession?.components?.[currentSession?.components.length - 1]

  const cleanCode = (code: string) => {
    return code
      .replace(/^```[\w]*\s*\n?/gm, "")
      .replace(/\n?```\s*$/gm, "")
      .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, "")
      .replace(/export\s+default\s+/g, "")
      .replace(/export\s+/g, "")
      .trim()
  }

  const cleanCSS = (css: string) => {
    return css
      .replace(/^```[\w]*\s*\n?/gm, "")
      .replace(/\n?```\s*$/gm, "")
      .trim()
  }

  const createIframeContent = () => {
    if (!activeComponent) return ""

    const cleanedJSX = cleanCode(activeComponent.jsxCode)
    const cleanedCSS = cleanCSS(activeComponent.cssCode)

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activeComponent.name} Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 20px;
      background: #f8fafc;
    }
    .preview-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    ${cleanedCSS}
  </style>
</head>
<body>
  <div class="preview-container">
    <div id="root"></div>
  </div>
  
  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo, useRef } = React;
    
    ${cleanedJSX}
    
    // Find the component name
    const componentNames = Object.getOwnPropertyNames(window).filter(name => 
      name.match(/^[A-Z]/) && typeof window[name] === 'function'
    );
    
    const ComponentToRender = window[componentNames[componentNames.length - 1]] || (() => React.createElement('div', null, 'Component not found'));
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(ComponentToRender, {
      onClick: () => console.log('Button clicked'),
      label: "Click Me",
      title: "Example Title",
      children: "Example Content"
    }));
  </script>
</body>
</html>`
  }

  useEffect(() => {
    if (activeComponent && iframeRef.current) {
      const iframe = iframeRef.current
      const content = createIframeContent()

      iframe.srcdoc = content
    }
  }, [activeComponent])

  const refreshPreview = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.srcdoc = createIframeContent()
    }
    setTimeout(() => setIsLoading(false), 500)
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

            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 w-8 p-0">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full p-6 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className={`transition-all duration-300 ${getViewportClass()}`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: "500px" }}>
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Refreshing preview...</span>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="Component Preview"
                  sandbox="allow-scripts"
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
