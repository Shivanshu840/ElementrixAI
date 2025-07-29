"use client"

import { useEffect, useState } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ChatPanel } from "@/components/dashboard/chat-panel"
import { CodeEditor } from "@/components/dashboard/code-editor"
import { ComponentPreview } from "@/components/dashboard/component-preview"
import { SessionSidebar } from "@/components/dashboard/session-sidebar"
// import { AppStoreProvider } from "@/lib/store2"

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        {/* Session Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <SessionSidebar />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Content */}
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="horizontal">
            {/* Chat Panel */}
            <ResizablePanel defaultSize={35} minSize={25}>
              <ChatPanel />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Code and Preview */}
            <ResizablePanel defaultSize={65}>
              <ResizablePanelGroup direction="vertical">
                {/* Preview */}
                <ResizablePanel defaultSize={60} minSize={30}>
                  <ComponentPreview />
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Code Editor */}
                <ResizablePanel defaultSize={40} minSize={20}>
                  <CodeEditor />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
