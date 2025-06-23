import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'data' | 'system';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${message.role === 'user' 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-md' 
          : 'bg-gray-100 border-2 border-gray-200'
        }
      `}>
        {message.role === 'user' ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-gray-600" />
        )}
      </div>

      <div className={`flex flex-col max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`
          px-4 py-3 rounded-2xl break-words shadow-sm
          ${message.role === 'user'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
            : 'bg-gray-50 text-gray-800 rounded-bl-md border border-gray-200'
          }
        `}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        {/* <span className="text-xs text-gray-500 mt-1 px-1 opacity-75">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span> */}
      </div>
    </div>
  );
};
