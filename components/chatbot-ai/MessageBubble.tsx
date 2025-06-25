import React from 'react';
import { Bot, RefreshCcw, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MessageAction } from '../prompt-kit/message';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'data' | 'system';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  reload: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  reload,
}) => {
  return (
    <div
      className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-md'
            : 'border-2 border-gray-200 bg-gray-100'
        } `}
      >
        {message.role === 'user' ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-gray-600" />
        )}
      </div>

      <div
        className={`flex max-w-[70%] flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-xs break-words shadow-sm ${
            message.role === 'user'
              ? 'rounded-br-md bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'rounded-bl-md border border-gray-200 bg-gray-50 text-gray-800'
          } `}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.role !== 'user' && status !== 'streaming' && (
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
  );
};
