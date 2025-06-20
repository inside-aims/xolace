"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Heart, Sparkles, SquareX, MessageCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { useOnlineStatus } from "@/hooks/use-online-status"
import BetaBadge from "../extras/beta-badge"
import { usePreferencesStore } from "@/lib/store/preferences-store"

const quickSuggestions = [
  "I'm feeling anxious today",
  "Help me manage stress",
  "I need motivation",
  "Breathing exercises",
  "How to improve sleep?",
  "Dealing with overthinking",
]

export function MobileOptimizedChat() {
  const [isOpen, setIsOpen] = useState(false)
  const { preferences } = usePreferencesStore()

  const { messages, input, setInput, handleSubmit, status, stop } = useChat({
    api: "/api/v1/chat",
    initialMessages: [
      {
        id: "1",
        content:
          "Hello! I'm Aniima AI, your mental health companion. I'm here to listen, support, and guide you through whatever you're experiencing. How are you feeling today? 💜",
        role: "assistant",
      },
    ],
  })

  const isOnline = useOnlineStatus()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (preferences?.guided_tour_enabled) {
    return null
  }

  return (
    <>
      {/* Mobile Full-Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 md:hidden">
          {/* Header */}
          <div className="border-border/50 from-lavender-300/20 to-lavender-500/20 dark:from-lavender-900/30 dark:to-lavender-900/50 border-b bg-gradient-to-r p-4 safe-area-top">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="from-lavender-700/20 to-lavender-500 h-10 w-10 border-2 border-white bg-gradient-to-br shadow-md">
                    <div className="flex h-full w-full items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </Avatar>
                  {isOnline ? (
                    <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-green-500">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                    </div>
                  ) : (
                    <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500">
                      <div className="h-2 w-2 rounded-full bg-red-400"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-foreground flex items-center gap-2 font-semibold">
                    Aniima AI
                    <Heart className="h-4 w-4 text-purple-500" />
                    <BetaBadge size="sm" variant="neural" />
                  </h3>
                  <p className="text-muted-foreground text-xs dark:text-white">Mental Health Companion</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="hover:bg-lavender-400 h-8 w-8 p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 h-[calc(100vh-140px)]" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "animate-fade-in flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <Avatar
                    className={cn(
                      "h-8 w-8 flex-shrink-0",
                      message.role === "assistant"
                        ? "from-lavender-700/20 to-lavender-500 bg-gradient-to-br"
                        : "to-ocean-500 bg-gradient-to-br from-cyan-500/30",
                    )}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-white" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "rounded-xl px-4 py-2 text-sm shadow-sm",
                        message.role === "user"
                          ? "bg-ocean-400 ml-8 text-white"
                          : "mr-8 bg-neutral-100 text-neutral-800",
                      )}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="mt-6">
                  <p className="text-muted-foreground mb-3 text-sm font-medium">Quick suggestions:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="border-border/50 cursor-pointer justify-start border bg-white px-4 py-3 text-sm transition-all hover:scale-[1.02] hover:shadow-sm dark:bg-neutral-800"
                        onClick={() => handleQuickSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-border/50 from-lavender-50 to-lavender-50 border-t bg-gradient-to-r p-4 safe-area-bottom">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Share your thoughts..."
                className="border-border/50 flex-1 rounded-xl bg-white focus:ring-2 focus:ring-purple-200 dark:bg-gray-800 dark:focus:ring-purple-800"
                disabled={status === "submitted" || status === "streaming"}
              />
              <Button
                type={status === "streaming" ? "button" : "submit"}
                onClick={status === "streaming" ? () => stop() : undefined}
                className={cn(
                  "rounded-xl shadow-md transition-all duration-200",
                  status === "streaming"
                    ? "bg-rose-400 hover:bg-rose-500 text-white"
                    : "from-lavender-700/20 to-lavender-400 hover:from-lavender-700/40 hover:to-lavender-500 bg-gradient-to-r text-white",
                )}
                disabled={!input.trim() && status !== "streaming"}
              >
                {status === "streaming" ? <SquareX className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Desktop Version - Use Enhanced Interface */}
      <div className="hidden md:block">{/* This would be replaced with the EnhancedAIChatInterface component */}</div>

      {/* Mobile FAB */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105",
            "bg-lavender-500 hover:bg-lavender-400",
          )}
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 animate-spin text-white/80" />
          </div>
        </Button>
      </div>
    </>
  )
}
