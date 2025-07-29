"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ChatPanel } from "@/components/dashboard/chat-panel"
import { CodeEditor } from "@/components/dashboard/code-editor"
import { ComponentPreview } from "@/components/dashboard/component-preview"
import { SessionSidebar } from "@/components/dashboard/session-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Code2, MessageSquare, FolderOpen, LogOut, User, Settings, ChevronDown } from "lucide-react"

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/auth/signin",
        redirect: true,
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserDisplayName = (user: any) => {
    return user?.name || user?.email?.split("@")[0] || "User"
  }

  if (!isMounted || status === "loading") {
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

  if (status === "unauthenticated") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Redirecting to sign in...</h3>
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
              <h1 className="text-lg font-semibold text-foreground">ElementrixAI</h1>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="secondary" className="text-xs font-medium">
              AI-Powered
            </Badge>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Online</span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 hover:bg-slate-100">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                      {getUserInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">{getUserDisplayName(session?.user)}</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName(session?.user)}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                    {session?.user?.provider && (
                      <Badge variant="outline" className="text-xs w-fit mt-1">
                        {session.user.provider}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    <span className="text-sm font-medium text-foreground">History</span>
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
                        <span className="text-sm font-medium text-foreground">Elementrix Assistant</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          Elementrix Flash
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
