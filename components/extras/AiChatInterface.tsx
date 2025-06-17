import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Bot,
  User,
  Heart,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation } from '@/app/api/v1/chatbot-ai/route';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

interface AIChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const quickSuggestions = [
  "I'm feeling anxious today",
  'Help me manage stress',
  'I need motivation',
  'Breathing exercises',
  'How to improve sleep?',
  'Dealing with overthinking',
];

// const aiResponses = [
//   "I understand you're feeling anxious. Let's take a moment to breathe together. Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. 🌸",
//   "Stress can feel overwhelming, but you're taking the right step by reaching out. What specific situation is causing you stress right now?",
//   "You have the strength within you! Remember, every small step forward is progress. What's one thing you accomplished today, no matter how small? ✨",
//   "Let's practice a simple breathing exercise. Close your eyes and take slow, deep breaths. Focus on the rhythm: in... and out... You're safe right now. 🌿",
//   "Good sleep is essential for mental well-being. Try creating a calming bedtime routine: dim lights, no screens 1 hour before bed, and perhaps some gentle stretching. 🌙",
//   "Overthinking is like being stuck in a mental loop. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. 🧘‍♀️"
// ]

export function AIChatInterface({
  isOpen,
  onClose,
  isMinimized,
  onToggleMinimize,
}: AIChatInterfaceProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    reload,
  } = useChat({
    api: '/api/v1/chat',
    initialMessages: [
      {
        id: '1',
        content:
          "Hello! I'm Aniima AI, your mental health companion. I'm here to listen, support, and guide you through whatever you're experiencing. How are you feeling today? 💜",
        role: 'assistant',
      },
    ],
  });

  // const [messages, setMessages] = useState<Message[]>([
  //   {
  //     id: "1",
  //     content: "Hello! I'm Aniima AI, your mental health companion. I'm here to listen, support, and guide you through whatever you're experiencing. How are you feeling today? 💜",
  //     sender: "ai",
  //     timestamp: new Date(),
  //   }
  // ])
  // const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const handleSendMessage = async (content: string) => {
  //   if (!content.trim() || isTyping) return;

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     content: content.trim(),
  //     sender: "user",
  //     timestamp: new Date(),
  //   }

  //   const newMessages = [...messages, userMessage];

  //   setMessages([
  //     ...newMessages,
  //     {
  //       id: (Date.now() + 1).toString(),
  //       content: "",
  //       sender: "ai",
  //       timestamp: new Date(),
  //     }
  //   ]);
  //   setInputValue("");
  //   setIsTyping(true);

  //   const result = await continueConversation(
  //     newMessages.map((m) => ({
  //       role: m.sender === "user" ? "user" : "assistant",
  //       content: m.content,
  //     }))
  //   );

  //   for await (const contentChunk of readStreamableValue(result)) {
  //     if (contentChunk) {
  //       setMessages((prev) => {
  //         const updated = [...prev];
  //         const last = updated[updated.length - 1];
  //         if (last.sender === "ai") {
  //           updated[updated.length - 1] = {
  //             ...last,
  //             content: last.content + contentChunk,
  //           };
  //         }
  //         return updated;
  //       });
  //     }
  //   }

  //   setIsTyping(false);
  // };

  const handleQuickSuggestion = (suggestion: string) => {
    //handleSubmit(suggestion)
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  const parsedErrorMessage = (() => {
    try {
      const parsed = JSON.parse(error?.message || '');
      return parsed.error || 'An unknown error occurred.';
    } catch {
      return error?.message || 'An unknown error occurred.';
    }
  })();

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Card
        className={cn(
          'bg-white shadow-2xl transition-all duration-300 ease-in-out',
          isMinimized ? 'h-18 w-96' : 'h-[600px] w-96',
        )}
      >
        {/* Header */}
        <CardHeader className="border-border/50 from-lavender-300/20 to-lavender-500/20 dark:from-lavender-900/30 dark:to-lavender-900/50 rounded-t-lg border-b bg-gradient-to-r pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="from-lavender-700/20 to-lavender-500 h-10 w-10 border-2 border-white bg-gradient-to-br shadow-md">
                  <div className="flex h-full w-full items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </Avatar>
                <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-green-500">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                </div>
              </div>
              <div>
                <h3 className="text-foreground flex items-center gap-2 font-semibold">
                  Aniima AI
                  <Heart className="h-4 w-4 text-purple-500" />
                </h3>
                <p className="text-muted-foreground text-xs dark:text-white">
                  Mental Health Companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="hover:bg-lavender-400 h-8 w-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-lavender-400 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex h-[calc(600px-80px)] flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      'animate-fade-in flex gap-3',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    <Avatar
                      className={cn(
                        'h-8 w-8 flex-shrink-0',
                        message.role === 'assistant'
                          ? 'from-lavender-700/20 to-lavender-500 bg-gradient-to-br'
                          : 'to-ocean-500 bg-gradient-to-br from-cyan-500/30',
                      )}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        {message.role === 'assistant' ? (
                          <Bot className="h-4 w-4 text-white" />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </Avatar>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm',
                        message.role === 'user'
                          ? 'bg-ocean-400 text-white'
                          : 'bg-neutral-100 text-neutral-800',
                      )}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      <p
                        className={cn(
                          'mt-1 text-xs opacity-70',
                          message.role === 'user'
                            ? 'text-blue-100'
                            : 'text-muted-foreground',
                        )}
                      >
                        {/* {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
                      </p>
                    </div>
                  </div>
                ))}

                {status === 'submitted' && (
                  <div className="animate-fade-in flex gap-3">
                    <Avatar className="from-lavender-700/20 to-lavender-500 flex h-8 w-8 items-center justify-center bg-gradient-to-br">
                      <Bot className="h-4 w-4 text-white" />
                    </Avatar>
                    <div className="border-border/50 rounded-2xl border bg-white px-4 py-3 shadow-sm dark:bg-gray-800">
                      <div className="flex gap-1">
                        <div className="bg-lavender-400 h-2 w-2 animate-bounce rounded-full"></div>
                        <div
                          className="bg-lavender-400 h-2 w-2 animate-bounce rounded-full"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="bg-lavender-400 h-2 w-2 animate-bounce rounded-full"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <>
                    <div className="text-rose-500 text-xs">
                      {parsedErrorMessage === "Insufficient credits" ? "You’ve used up your free AI chats this month. Please wait for the next cycle or upgrade if available." : parsedErrorMessage}
                    </div>
                    <button type="button" onClick={() => reload()}>
                      Retry
                    </button>
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className="border-border/50 from-lavender-50 to-ocean-50 border-t bg-gradient-to-r p-4">
                <p className="text-muted-foreground mb-3 text-xs font-medium">
                  Quick suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="border-border/50 cursor-pointer border bg-white px-3 py-1 text-xs transition-transform hover:scale-105 dark:bg-neutral-800"
                      onClick={() => handleQuickSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-border/50 from-lavender-50 to-lavender-50 border-t bg-gradient-to-r p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Share your thoughts..."
                  className="border-border/50 flex-1 rounded-xl bg-white focus:ring-2 focus:ring-purple-200 dark:bg-gray-800 dark:focus:ring-purple-800"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  className="from-lavender-700/20 to-lavender-400 hover:from-lavender-700/40 hover:to-lavender-500 rounded-xl bg-gradient-to-r text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
