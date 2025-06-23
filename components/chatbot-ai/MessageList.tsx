import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { type Message } from '@ai-sdk/react';

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  reload: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, error, reload }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-3 sm:p-4 min-h-0">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} reload={reload} />
        ))}
        
        {isTyping && <TypingIndicator />}

        {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
