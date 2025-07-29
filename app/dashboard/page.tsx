"use client"

import { useEffect, useState } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ChatPanel } from "@/components/dashboard/chat-panel"
import { CodeEditor } from "@/components/dashboard/code-editor"
import { ComponentPreview } from "@/components/dashboard/component-preview"
import { SessionSidebar } from "@/components/dashboard/session-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Code2, MessageSquare, FolderOpen } from "lucide-react"

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Main Dashboard Container */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="h-14 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">Component Studio</h1>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="secondary" className="text-xs font-medium">
              AI-Powered
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Session Sidebar */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="relative">
              <div className="h-full bg-white border-r border-border/50 shadow-sm">
                <div className="h-12 border-b border-border/50 flex items-center px-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Sessions</span>
                  </div>
                </div>
                <div className="h-[calc(100%-3rem)] overflow-hidden">
                  <SessionSidebar />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="w-1 bg-border/30 hover:bg-border/60 transition-colors" />

            {/* Main Content */}
            <ResizablePanel defaultSize={80} className="relative">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Chat Panel */}
                <ResizablePanel defaultSize={35} minSize={25} className="relative">
                  <div className="h-full bg-white border-r border-border/50 shadow-sm">
                    <div className="h-12 border-b border-border/50 flex items-center px-4 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-foreground">AI Assistant</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          Gemini Flash
                        </Badge>
                      </div>
                    </div>
                    <div className="h-[calc(100%-3rem)] overflow-hidden">
                      <ChatPanel />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="w-1 bg-border/30 hover:bg-border/60 transition-colors" />

                {/* Code and Preview */}
                <ResizablePanel defaultSize={65} className="relative">
                  <ResizablePanelGroup direction="vertical" className="h-full">
                    {/* Preview */}
                    <ResizablePanel defaultSize={60} minSize={30} className="relative">
                      <div className="h-full bg-white border-b border-border/50 shadow-sm">
                        <div className="h-12 border-b border-border/50 flex items-center px-4 bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-foreground">Live Preview</span>
                            <Badge variant="outline" className="text-xs ml-auto">
                              Interactive
                            </Badge>
                          </div>
                        </div>
                        <div className="h-[calc(100%-3rem)] overflow-hidden">
                          <ComponentPreview />
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="h-1 bg-border/30 hover:bg-border/60 transition-colors" />

                    {/* Code Editor */}
                    <ResizablePanel defaultSize={40} minSize={20} className="relative">
                      <div className="h-full bg-white shadow-sm">
                        <div className="h-12 border-b border-border/50 flex items-center px-4 bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-foreground">Source Code</span>
                            <Badge variant="outline" className="text-xs ml-auto">
                              TypeScript
                            </Badge>
                          </div>
                        </div>
                        <div className="h-[calc(100%-3rem)] overflow-hidden">
                          <CodeEditor />
                        </div>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
