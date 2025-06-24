import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChat } from '@ai-sdk/react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isOnline = useOnlineStatus();

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    status,
    error,
    stop,
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

  // Handle online/offline status
  useEffect(() => {
    const cleanup = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (!isOnline) {
      if (!toastIdRef.current) {
        toastIdRef.current = toast.loading('Reconnecting...', {
          duration: Number.POSITIVE_INFINITY,
        });
      }

      cleanup();
      timeoutRef.current = setTimeout(() => {
        if (!isOnline && toastIdRef.current) {
          toast.error('You are offline. Please check your connection.', {
            id: toastIdRef.current,
            duration: 5000,
          });
          toastIdRef.current = null;
        }
      }, 50000);
    } else if (toastIdRef.current) {
      cleanup();
      toast.success('Reconnected', {
        id: toastIdRef.current,
        duration: 2000,
      });
      toastIdRef.current = null;
    }

    return cleanup;
  }, [isOnline]);

  // More robust error parsing and logging
  const parsedErrorMessage = (() => {
    if (!error) return null;

    console.error('Chat Error:', error); // Log the full error object to the console

    try {
      // Attempt to parse a JSON message
      const parsed = JSON.parse(error.message);
      return parsed.error || 'An unexpected error occurred.';
    } catch {
      console.log('error ', error);
      // Fallback to the raw error message
      return error.message || 'An unexpected error occurred.';
    }
  })();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     role: 'user',
  //     content: input.trim(),
  //     timestamp: new Date(),
  //   };

  //   setMessages(prev => [...prev, userMessage]);
  //   setInput('');
  //   setIsTyping(true);

  //   // Simulate AI response
  //   setTimeout(() => {
  //     const responses = [
  //       "I understand how you're feeling. It's completely normal to have these emotions. Would you like to talk more about what's on your mind?",
  //       "Thank you for sharing that with me. Your feelings are valid, and I'm here to support you through this.",
  //       "That sounds challenging. Remember that it's okay to take things one step at a time. What would help you feel more at ease right now?",
  //       "I appreciate you opening up to me. Mental health is just as important as physical health, and seeking support shows strength.",
  //       "It's brave of you to reach out. Sometimes talking about our feelings can help us process them better. How has your day been overall?",
  //     ];

  //     const aiMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       role: 'assistant',
  //       content: responses[Math.floor(Math.random() * responses.length)],
  //       timestamp: new Date(),
  //     };

  //     setMessages(prev => [...prev, aiMessage]);
  //     setIsTyping(false);
  //   }, 1500);
  // };

  const toggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="fixed right-4 bottom-10 z-50 sm:right-6 sm:bottom-6">
      <div className="group relative">
        {/* Floating Action Button */}
        <Button
          onClick={toggleOpen}
          className={`from-lavender-500 hover:from-lavender-600 h-12 w-12 rounded-full bg-gradient-to-r to-pink-500 shadow-lg transition-all duration-300 ease-out hover:to-pink-600 hover:shadow-xl sm:h-16 sm:w-16 ${
            isOpen
              ? 'scale-75 opacity-60'
              : 'scale-100 opacity-100 hover:scale-110'
          } `}
          disabled={isOpen}
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            <Sparkles className="absolute -top-1 right-1 h-3 w-3 animate-spin text-white/80" />
          </div>
        </Button>

        {/* Floating Label - Only show when closed */}
        {!isOpen && (
          <div className="pointer-events-none absolute top-1/2 right-20 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 whitespace-nowrap text-gray-800 shadow-lg">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Chat with Aniima AI
              </p>
              <p className="text-xs text-gray-600">
                Your mental health companion
              </p>
            </div>
            <div className="absolute top-1/2 left-full h-0 w-0 -translate-x-1 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-white"></div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div
          className={`absolute right-0 bottom-16 flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-out sm:bottom-20 ${isMinimized ? 'h-16 w-80 sm:w-96' : 'h-[500px] w-80 sm:h-[600px] sm:w-96'} `}
        >
          <ChatHeader
            isOnline={isOnline}
            onMinimize={toggleMinimize}
            onClose={closeChat}
            isMinimized={isMinimized}
          />

          {!isMinimized && (
            <>
              <MessageList
                messages={messages}
                isTyping={status === 'submitted'}
                error={parsedErrorMessage}
                reload={reload}
              />
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                isOnline={isOnline}
                streaming={status === 'streaming'}
                stop={stop}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
