"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { toast } from "sonner"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Bot,
  User,
  Heart,
  Sparkles,
  X,
  RefreshCcw,
  SquareX,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { MessageAction } from "@/components/prompt-kit/message"
import BetaBadge from "@/components/extras/beta-badge"
//import { usePreferencesStore } from "@/lib/store/preferences-store"

type ChatState = "closed" | "minimized" | "expanded"

const quickSuggestions = [
  "I'm feeling anxious today",
  "Help me manage stress",
  "I need motivation",
  "Breathing exercises",
  "How to improve sleep?",
  "Dealing with overthinking",
]

export default function EnhancedAIChatInterface() {
  const [chatState, setChatState] = useState<ChatState>("closed")
  const [isAnimating, setIsAnimating] = useState(false)
  //const { preferences } = usePreferencesStore()

  const [streamingEnabled, setStreamingEnabled] = useState(true)

  useEffect(() => {
    const hasStreams =
      typeof window.ReadableStream !== "undefined" &&
      typeof window.TextEncoderStream !== "undefined" &&
      typeof window.TextDecoderStream !== "undefined"
    setStreamingEnabled(hasStreams)
  }, [])
  


  const { messages, input, setInput, handleSubmit, status, error, reload, stop } = useChat({
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


  const toastIdRef = useRef<string | number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
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

  const handleStateChange = (newState: ChatState) => {
    if (isAnimating) return

    setIsAnimating(true)
    setChatState(newState)

    // Focus input when expanding
    if (newState === "expanded") {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }

    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion)
    if (chatState !== "expanded") {
      handleStateChange("expanded")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    const cleanup = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    if (!isOnline) {
      if (!toastIdRef.current) {
        toastIdRef.current = toast.loading("Reconnecting...", {
          duration: Number.POSITIVE_INFINITY,
        })
      }

      cleanup()
      timeoutRef.current = setTimeout(() => {
        if (!isOnline && toastIdRef.current) {
          toast.error("You are offline. Please check your connection.", {
            id: toastIdRef.current,
            duration: 5000,
          })
          toastIdRef.current = null
        }
      }, 50000)
    } else if (toastIdRef.current) {
      cleanup()
      toast.success("Reconnected", {
        id: toastIdRef.current,
        duration: 2000,
      })
      toastIdRef.current = null
    }

    return cleanup
  }, [isOnline])

// More robust error parsing and logging
const parsedErrorMessage = (() => {
  if (!error) return null;

  try {
    // Attempt to parse a JSON message
    const parsed = JSON.parse(error.message);
    return parsed.error || "An unexpected error occurred.";
  } catch {
    console.log("error ", error)
    // Fallback to the raw error message
    return error.message || "An unexpected error occurred.";
  }
})();


  return (
    <>
      {/* Backdrop for mobile */}
      {chatState !== "closed" && (
        <div
          className={cn(
            "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
            chatState === "expanded" ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={() => handleStateChange("closed")}
        />
      )}

      {/* Main Chat Container */}
      <div className="fixed bottom-10 right-4 md:right-9 w-15  z-50 flex flex-col items-end">
        {/* Chat Interface */}
        <div
          className={cn(
            "mb-4 transition-all duration-300 ease-out origin-bottom-right",
            chatState === "closed" && "scale-0 opacity-0 pointer-events-none",
            chatState === "minimized" && "scale-100 opacity-100",
            chatState === "expanded" && "scale-100 opacity-100",
          )}
        >
          <Card
            className={cn(
              "bg-white transition-all duration-300 ease-out border-purple-200 overflow-hidden",
              "w-96 max-w-[calc(100vw-2rem)]",
              chatState === "minimized" && "h-16 shadow-lg",
              chatState === "expanded" && "h-[560px] max-h-[calc(100vh-9rem)] shadow-2xl",
            )}
          >
            {/* Header - Always Visible */}
            <div className="bg-gradient-to-r from-lavender-600/50 to-lavender-500/50 rounded-t-lg border-b border-purple-200/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600 shadow-md">
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
                  <div className="min-w-0 flex-1">
                    <h3 className="text-gray-800 flex items-center gap-2 font-semibold text-sm md:text-base">
                      <span
                        className={cn(
                          "transition-opacity duration-200",
                          chatState === "minimized" && " sm:inline",
                        )}
                      >
                        Aniima AI
                      </span>
                      <Heart
                        className={cn(
                          "h-4 w-4 text-purple-500 transition-opacity duration-200",
                          chatState === "minimized" && " sm:inline",
                        )}
                      />
                      <BetaBadge size="sm" variant="neural" />
                    </h3>
                    <p
                      className={cn(
                        "text-gray-600 text-xs transition-all duration-200",
                        chatState === "minimized" && " overflow-hidden",
                      )}
                    >
                      Mental Health Companion
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStateChange(chatState === "expanded" ? "minimized" : "expanded")}
                    className="hover:bg-purple-100 h-8 w-8 p-0 flex-shrink-0"
                    disabled={isAnimating}
                  >
                    {chatState === "expanded" ? <ChevronDown className="h-4 w-4 text-black" /> : <ChevronUp className="h-4 w-4 text-black" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStateChange("closed")}
                    className="hover:bg-purple-100 h-8 w-8 p-0 flex-shrink-0"
                    disabled={isAnimating}
                  >
                    <X className="h-4 w-4 text-black" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Content - Only when expanded */}
            {chatState === "expanded" && (
              <CardContent className="flex h-[calc(560px-80px)] max-h-[calc(100vh-10rem)] flex-col p-0 overflow-hidden">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
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
                              ? "bg-gradient-to-br from-purple-400 to-purple-600"
                              : "bg-gradient-to-br from-blue-400 to-blue-600",
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
                                ? "bg-blue-500 ml-8 text-white"
                                : "mr-8 bg-gray-100 text-gray-800",
                            )}
                          >
                            <ReactMarkdown>
                              {message.content}
                            </ReactMarkdown>
                          </div>

                          {message.role !== "user" && status !== "streaming" && (
                            <div className="mt-1 mb-2 flex items-center gap-2">
                              <MessageAction tooltip="Retry" side="bottom">
                                <button
                                  className="text-gray-400 transition-colors hover:text-gray-600"
                                  onClick={() => reload()}
                                >
                                  <RefreshCcw className="h-4 w-4" />
                                </button>
                              </MessageAction>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {status === "submitted" && (
                      <div className="animate-fade-in flex gap-3">
                        <Avatar className="flex h-8 w-8 items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
                          <Bot className="h-4 w-4 text-white" />
                        </Avatar>
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                          <div className="flex gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400"></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-rose-500 flex-1">
                          {parsedErrorMessage === "Insufficient credits"
                            ? "You've used up your free AI chats this month. Please wait for the next cycle or upgrade if available."
                            : parsedErrorMessage}
                        </div>
                        <MessageAction tooltip="Retry" side="bottom">
                          <button type="button" onClick={() => reload()}>
                            <RefreshCcw className="h-4 w-4 text-black" />
                          </button>
                        </MessageAction>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Quick Suggestions */}
                {messages.length <= 1 && (
                  <div className="border-t border-gray-200 bg-gradient-to-r from-lavender-400/50 to-ocean-300/50 p-4">
                    <p className="text-gray-600 mb-3 text-xs font-medium">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer border border-gray-200 bg-muted px-3 py-1 text-xs transition-all hover:scale-105 hover:shadow-sm"
                          onClick={() => handleQuickSuggestion(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-gray-200 bg-gradient-to-r from-purple-50 to-purple-50 p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Share your thoughts..."
                      className="flex-1 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-200"
                      disabled={status === "submitted" || status === "streaming"}
                    />
                    <Button
                      type={status === "streaming" ? "button" : "submit"}
                      onClick={status === "streaming" ? () => stop() : undefined}
                      className={cn(
                        "rounded-xl shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg",
                        status === "streaming"
                          ? "bg-rose-400 hover:bg-rose-500 text-white"
                          : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white",
                      )}
                      disabled={!input.trim() && status !== "streaming"}
                    >
                      {status === "streaming" ? <SquareX className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                  <p className="text-[10px] text-gray-500">Aniima AI is not a substitute for professional medical advice, diagnosis, or treatment.</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Floating Action Button */}
        <div className={cn("transition-all duration-300 ease-out", chatState !== "closed" && "scale-75 opacity-60")}>
          <div className="relative group">
            <Button
              onClick={() => handleStateChange("expanded")}
              disabled={isAnimating}
              className={cn(
                "h-12 w-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-105",
                "bg-purple-500 hover:bg-purple-400",
                chatState !== "closed" && "pointer-events-none",
              )}
            >
              <div className="relative">
                <MessageCircle className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
                <Sparkles className="absolute -top-1 right-1 h-3 w-3 animate-spin text-white/80" />
              </div>
            </Button>

            {/* Floating Label - Only show when closed */}
            {chatState === "closed" && (
              <div className="pointer-events-none absolute top-1/2 right-20 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 whitespace-nowrap shadow-lg text-gray-800">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Chat with Aniima AI
                  </p>
                  <p className="text-gray-600 text-xs">Your mental health companion</p>
                </div>
                <div className="absolute top-1/2 left-full h-0 w-0 -translate-x-1 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
