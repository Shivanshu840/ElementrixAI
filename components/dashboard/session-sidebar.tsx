"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare, Trash2, Edit3, Check, X, Folder, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function SessionSidebar() {
  const [isCreating, setIsCreating] = useState(false)
  const [newSessionTitle, setNewSessionTitle] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  const { sessions, currentSession, createNewSession, deleteSession, setCurrentSessionById, updateSessionTitle } =
    useAppStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCreateSession = () => {
    if (newSessionTitle.trim()) {
      createNewSession(newSessionTitle.trim())
      setNewSessionTitle("")
      setIsCreating(false)
    }
  }

  const handleEditSession = (id: string, title: string) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateSessionTitle(editingId, editTitle.trim())
      setEditingId(null)
      setEditTitle("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  const formatDate = (date: Date | string | number) => {
    if (!isMounted) return "Loading..."

    try {
      const dateObj = date instanceof Date ? date : new Date(date)

      if (isNaN(dateObj.getTime())) {
        return "Invalid date"
      }

      const now = new Date()
      const diff = now.getTime() - dateObj.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (days === 0) return "Today"
      if (days === 1) return "Yesterday"
      if (days < 7) return `${days} days ago`
      return dateObj.toLocaleDateString()
    } catch (error) {
      return "Invalid date"
    }
  }

  if (!isMounted) {
    return (
      <Card className="h-full flex flex-col border-r">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Sessions</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col border-r">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Sessions</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsCreating(true)} className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Create New Session */}
          {isCreating && (
            <div className="space-y-2">
              <Input
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="Session name..."
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateSession()
                  if (e.key === "Escape") {
                    setIsCreating(false)
                    setNewSessionTitle("")
                  }
                }}
              />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCreateSession}
                  disabled={!newSessionTitle.trim()}
                  className="h-7 px-2"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false)
                    setNewSessionTitle("")
                  }}
                  className="h-7 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sessions List */}
        <ScrollArea className="flex-1">
          <div className="p-4 pt-0 space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No sessions yet</p>
                <p className="text-xs">Create one to get started</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative rounded-lg border p-3 cursor-pointer transition-all hover:shadow-sm",
                    currentSession?.id === session.id
                      ? "bg-primary/5 border-primary/20 shadow-sm"
                      : "hover:bg-accent/50",
                  )}
                  onClick={() => setCurrentSessionById(session.id)}
                >
                  {editingId === session.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-7 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit()
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                      />
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={handleSaveEdit} className="h-6 px-2">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-6 px-2">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{session.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(session.createdAt)}
                            </div>
                            {session.components.length > 0 && (
                              <Badge variant="secondary" className="text-xs h-4 px-1">
                                {session.components.length}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditSession(session.id, session.title)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSession(session.id)
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {session.messages.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {session.messages[session.messages.length - 1]?.content}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
