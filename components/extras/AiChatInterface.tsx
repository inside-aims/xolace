import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
  Minimize2,
  Maximize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {readStreamableValue} from "ai/rsc";
import {continueConversation} from "@/app/api/v1/chatbot-ai/route";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "suggestion"
}

interface AIChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  isMinimized: boolean
  onToggleMinimize: () => void
}

const quickSuggestions = [
  "I'm feeling anxious today",
  "Help me manage stress",
  "I need motivation",
  "Breathing exercises",
  "How to improve sleep?",
  "Dealing with overthinking"
]

// const aiResponses = [
//   "I understand you're feeling anxious. Let's take a moment to breathe together. Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. 🌸",
//   "Stress can feel overwhelming, but you're taking the right step by reaching out. What specific situation is causing you stress right now?",
//   "You have the strength within you! Remember, every small step forward is progress. What's one thing you accomplished today, no matter how small? ✨",
//   "Let's practice a simple breathing exercise. Close your eyes and take slow, deep breaths. Focus on the rhythm: in... and out... You're safe right now. 🌿",
//   "Good sleep is essential for mental well-being. Try creating a calming bedtime routine: dim lights, no screens 1 hour before bed, and perhaps some gentle stretching. 🌙",
//   "Overthinking is like being stuck in a mental loop. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. 🧘‍♀️"
// ]

export function AIChatInterface({ isOpen, onClose, isMinimized, onToggleMinimize }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Aniima AI, your mental health companion. I'm here to listen, support, and guide you through whatever you're experiencing. How are you feeling today? 💜",
      sender: "ai",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // const generateAIResponse = (userMessage: string): string => {
  //   const lowerMessage = userMessage.toLowerCase()
  //
  //   if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
  //     return aiResponses[0]
  //   } else if (lowerMessage.includes('stress')) {
  //     return aiResponses[1]
  //   } else if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated')) {
  //     return aiResponses[2]
  //   } else if (lowerMessage.includes('breath') || lowerMessage.includes('breathing')) {
  //     return aiResponses[3]
  //   } else if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
  //     return aiResponses[4]
  //   } else if (lowerMessage.includes('overthink') || lowerMessage.includes('thinking')) {
  //     return aiResponses[5]
  //   } else {
  //     return `I hear you, and your feelings are valid. Thank you for sharing with me. Remember, it's okay to not be okay sometimes. What would help you feel a little better right now? 💙`
  //   }
  // }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage];

    setMessages([
      ...newMessages,
      {
        id: (Date.now() + 1).toString(),
        content: "",
        sender: "ai",
        timestamp: new Date(),
      }
    ]);
    setInputValue("");
    setIsTyping(true);

    const result = await continueConversation(
      newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      }))
    );

    for await (const contentChunk of readStreamableValue(result)) {
      if (contentChunk) {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.sender === "ai") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + contentChunk,
            };
          }
          return updated;
        });
      }
    }

    setIsTyping(false);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion).then();
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue).then()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={cn(
        "transition-all duration-300 ease-in-out shadow-2xl bg-white",
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      )}>
        {/* Header */}
        <CardHeader className="pb-3 border-b border-border/50 bg-gradient-to-r from-lavender-300/20 to-lavender-500/20 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10 bg-gradient-to-br from-lavender-700/20 to-lavender-500 border-2 border-white shadow-md">
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Aniima AI
                  <Heart className="w-4 h-4 text-purple-500" />
                </h3>
                <p className="text-xs text-muted-foreground dark:text-white">Mental Health Companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="w-8 h-8 p-0 hover:bg-lavender-100"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 hover:bg-lavender-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 animate-fade-in",
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className={cn(
                      "w-8 h-8 flex-shrink-0",
                      message.sender === "ai" 
                        ? "bg-gradient-to-br from-lavender-700/20 to-lavender-500"
                        : "bg-gradient-to-br from-cyan-500/30 to-ocean-500"
                    )}>
                      <div className="w-full h-full flex items-center justify-center">
                        {message.sender === "ai" ? (
                          <Bot className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl px-4 py-2 shadow-sm text-sm",
                        message.sender === "user"
                          ? "bg-ocean-400 text-white"
                          : "bg-neutral-100 text-neutral-800"
                      )}
                    >
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                      <p className={cn(
                        "text-xs mt-1 opacity-70",
                        message.sender === "user" ? "text-blue-100" : "text-muted-foreground"
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 animate-fade-in">
                    <Avatar className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-lavender-700/20 to-lavender-500">
                      <Bot className="w-4 h-4 text-white" />
                    </Avatar>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-border/50">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-border/50 bg-gradient-to-r from-lavender-50 to-ocean-50">
                <p className="text-xs text-muted-foreground mb-3 font-medium">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:scale-105 transition-transform bg-white dark:bg-neutral-800 text-xs py-1 px-3 border border-border/50"
                      onClick={() => handleQuickSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-gradient-to-r from-lavender-50 to-lavender-50 ">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Share your thoughts..."
                  className="flex-1 rounded-xl border-border/50 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="rounded-xl bg-gradient-to-r from-lavender-700/20 to-lavender-400 hover:from-lavender-700/40 hover:to-lavender-500 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}