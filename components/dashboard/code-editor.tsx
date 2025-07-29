"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Check, Code2, Palette } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

export function CodeEditor() {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const { currentSession } = useAppStore()
  const { theme } = useTheme()

  const activeComponent =
    currentSession?.components?.find((c) => c.id === currentSession.activeComponentId) ||
    currentSession?.components?.[currentSession?.components.length - 1]

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTab(tab)
      setTimeout(() => setCopiedTab(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const downloadCode = () => {
    if (!activeComponent) return

    const files = [
      {
        name: `${activeComponent.name.toLowerCase().replace(/\s+/g, "-")}.tsx`,
        content: activeComponent.jsxCode,
      },
      {
        name: `${activeComponent.name.toLowerCase().replace(/\s+/g, "-")}.css`,
        content: activeComponent.cssCode || "/* No CSS styles */",
      },
    ]

    files.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  const syntaxTheme = theme === "dark" ? oneDark : oneLight

  if (!activeComponent) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-500" />
            Source Code
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Code2 className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Code Available</h3>
              <p className="text-sm">Generate a component to view its source code</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Source Code</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              v{activeComponent.version}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `${activeComponent.jsxCode}\n\n/* CSS Styles */\n${activeComponent.cssCode || "/* No styles */"}`,
                  "all",
                )
              }
              className="h-8"
            >
              {copiedTab === "all" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy All
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode} className="h-8 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="jsx" className="h-full flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jsx" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                React Component
              </TabsTrigger>
              <TabsTrigger value="css" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Styles
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jsx" className="flex-1 m-0 overflow-hidden">
            <div className="h-full relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 h-8"
                onClick={() => copyToClipboard(activeComponent.jsxCode, "jsx")}
              >
                {copiedTab === "jsx" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                className="h-full !m-0"
                customStyle={{
                  background: "transparent",
                  padding: "1rem",
                  margin: 0,
                  height: "100%",
                  overflow: "auto",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
                showLineNumbers
                wrapLines
              >
                {activeComponent.jsxCode}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="css" className="flex-1 m-0 overflow-hidden">
            <div className="h-full relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 h-8"
                onClick={() => copyToClipboard(activeComponent.cssCode || "", "css")}
              >
                {copiedTab === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <SyntaxHighlighter
                language="css"
                style={syntaxTheme}
                className="h-full !m-0"
                customStyle={{
                  background: "transparent",
                  padding: "1rem",
                  margin: 0,
                  height: "100%",
                  overflow: "auto",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
                showLineNumbers
                wrapLines
              >
                {activeComponent.cssCode || "/* No CSS styles generated */"}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
