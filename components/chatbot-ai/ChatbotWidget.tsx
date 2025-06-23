import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Aniima AI, your mental health companion. How are you feeling today? I'm here to listen and support you.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error('You appear to be offline. Some features may not work properly.');
    }
  }, [isOnline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand how you're feeling. It's completely normal to have these emotions. Would you like to talk more about what's on your mind?",
        "Thank you for sharing that with me. Your feelings are valid, and I'm here to support you through this.",
        "That sounds challenging. Remember that it's okay to take things one step at a time. What would help you feel more at ease right now?",
        "I appreciate you opening up to me. Mental health is just as important as physical health, and seeking support shows strength.",
        "It's brave of you to reach out. Sometimes talking about our feelings can help us process them better. How has your day been overall?",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

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
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Floating Action Button */}
      <Button
        onClick={toggleOpen}
        className={`
          w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
          hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl 
          transition-all duration-300 ease-out
          ${isOpen 
            ? 'scale-75 opacity-60' 
            : 'scale-100 opacity-100 hover:scale-110'
          }
        `}
        disabled={isOpen}
      >
        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <div 
          className={`
            absolute bottom-16 right-0 sm:bottom-20
            bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden 
            flex flex-col max-h-[90vh]
            transition-all duration-300 ease-out
            ${isMinimized ? 'w-80 sm:w-96 h-16' : 'w-80 sm:w-96 h-[500px] sm:h-[600px]'}
          `}
        >
          <ChatHeader
            isOnline={isOnline}
            onMinimize={toggleMinimize}
            onClose={closeChat}
          />

          {!isMinimized && (
            <>
              <MessageList messages={messages} isTyping={isTyping} />
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                isOnline={isOnline}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
