"use client"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { UserProfileDropdown } from "./user-profile-dropdown"

export function DashboardHeader() {
  return (
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

        <UserProfileDropdown />
      </div>
    </div>
  )
}
