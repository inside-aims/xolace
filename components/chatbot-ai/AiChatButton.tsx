'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AIChatInterface } from './AiChatInterface';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setIsMinimized(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isChatOpen) {
    return (
      <AIChatInterface
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
    );
  }

  return (
    <div className="">
      <div className="relative">
        {/* Floating Action Button */}
        <Button
          onClick={handleOpenChat}
          className={cn(
            'group h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105',
            'bg-lavender-500',
            'hover:bg-lavender-400',
          )}
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white transition-transform group-hover:scale-110" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 animate-spin text-white/80" />
          </div>
        </Button>

        {/* Floating Label */}
        <div className="pointer-events-none absolute top-1/2 right-20 -translate-y-1/2 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="text-foreground border-border/50 rounded-lg border bg-white px-3 py-2 whitespace-nowrap shadow-lg dark:bg-gray-800">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Chat with Aniima AI
            </p>
            <p className="text-muted-foreground text-xs">
              Your mental health companion
            </p>
          </div>
          {/* Arrow */}
          <div className="absolute top-1/2 left-full h-0 w-0 -translate-x-1 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-white dark:border-l-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
