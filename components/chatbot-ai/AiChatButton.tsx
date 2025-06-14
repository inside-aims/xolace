'use client';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIChatInterface } from "../extras/AiChatInterface"
import { MessageCircle, Sparkles, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(true)

  const handleOpenChat = () => {
    setIsChatOpen(true)
    setIsMinimized(false)
    setHasNewMessage(false)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setIsMinimized(false)
  }

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  if (isChatOpen) {
    return (
      <AIChatInterface
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
    )
  }

  return (
    <div className="">
      <div className="relative">
        {/* Floating Action Button */}
        <Button
          onClick={handleOpenChat}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl border-0 transition-all duration-300 hover:scale-110 group",
            "bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500",
            "hover:from-purple-600 hover:via-pink-600 hover:to-blue-600",
            "animate-pulse hover:animate-none"
          )}
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
            <Sparkles className="w-3 h-3 text-white/80 absolute -top-1 -right-1 animate-spin" />
          </div>
        </Button>

        {/* Notification Badge */}
        {hasNewMessage && (
          <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-500 text-white text-xs p-0 flex items-center justify-center animate-bounce">
            <Heart className="w-3 h-3" />
          </Badge>
        )}

        {/* Floating Label */}
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white dark:bg-gray-800 text-foreground px-3 py-2 rounded-lg shadow-lg border border-border/50 whitespace-nowrap">
            <p className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Chat with Aniima AI
            </p>
            <p className="text-xs text-muted-foreground">Your mental health companion</p>
          </div>
          {/* Arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-l-8 border-l-white dark:border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      </div>

      {/* Ambient Animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 opacity-20 animate-ping pointer-events-none"></div>
    </div>
  )
}