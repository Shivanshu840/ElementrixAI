"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Loader2, Sparkles, AlertCircle, X, MessageSquare, Zap } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ChatPanel() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { currentSession, addMessage, updateComponent, setActiveComponent } = useAppStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current && currentSession?.messages?.length) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [currentSession?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) {
      return
    }

    // Ensure currentSession and its ID exist before proceeding
    if (!currentSession || !currentSession.id) {
      setError("Please create or select a session first to start chatting.")
      return
    }

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)
    setError(null)

    addMessage({
      role: "user",
      content: userMessage,
    })

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: currentSession.id, // Make sure this is correctly named
        }),
      })

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      addMessage({
        role: "assistant",
        content: data.message || "Response received",
      })

      if (data.component && data.component.jsxCode && data.component.jsxCode !== "// Component code not available") {
        const newComponent = {
          id: data.component.id || Date.now().toString(),
          name: data.component.name,
          jsxCode: data.component.jsxCode,
          cssCode: data.component.cssCode || "",
          version: data.component.version || 1,
        }

        updateComponent(newComponent)
        setActiveComponent(newComponent.id)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)

      addMessage({
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedPrompts = [
    "Create a modern login form with validation",
    "Build a responsive pricing card",
    "Make a loading spinner animation",
    "Design a navigation menu",
    "Create a dashboard widget",
  ]

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const clearError = () => {
    setError(null)
  }

  if (!isMounted) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chat...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get messages safely with fallback to empty array
  const messages = currentSession?.messages || []

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Gemini Flash
            </Badge>
          </div>
        </div>

        {currentSession && (
          <p className="text-sm text-muted-foreground mt-2">Session: {currentSession.title || currentSession.id}</p>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Let's Build Something Amazing!</h3>
                  <p className="text-sm text-muted-foreground mb-6">Describe the component you'd like to create</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Try these suggestions:</p>
                  {suggestedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3 whitespace-normal hover:bg-accent/50 transition-colors bg-transparent"
                      onClick={() => handleSuggestedPrompt(prompt)}
                      disabled={isLoading || !currentSession?.id} // Disable if no session ID
                    >
                      <Sparkles className="h-4 w-4 mr-3 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 border-2 border-green-200">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-gradient-to-br from-green-50 to-blue-50 border border-green-100",
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        AI Assistant
                      </Badge>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ""}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 border-2 border-green-200">
                  <AvatarFallback className="bg-green-100 text-green-700">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-sm text-green-700">Creating your component...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <div className="p-4 border-t bg-muted/30">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentSession?.id ? "Describe your component..." : "Create a session first..."}
            disabled={isLoading || !currentSession?.id} // Disable if no session ID
            className="flex-1 bg-background"
          />
          <Button type="submit" disabled={isLoading || !input.trim() || !currentSession?.id} className="px-6">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  )
}
