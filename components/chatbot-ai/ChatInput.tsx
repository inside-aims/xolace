import React from 'react';
import { Send, SquareX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isOnline: boolean;
  streaming: boolean;
  stop: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isOnline,
  streaming,
  stop,
}) => {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3 sm:p-4">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Share your thoughts..."
          className="dark:bg-muted-dark flex-1 border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          disabled={!isOnline}
        />
        <Button
          type={streaming ? 'button' : 'submit'}
          onClick={streaming ? () => stop() : undefined}
          className={cn(
            'rounded-xl shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg',
            streaming
              ? 'bg-rose-400 text-white hover:bg-rose-500'
              : 'from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 bg-gradient-to-r text-white',
          )}
          disabled={!input.trim() && streaming}
        >
          {streaming ? (
            <SquareX className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      {!isOnline && (
        <p className="mt-2 text-xs text-red-500">
          You&apos;re currently offline. Please check your connection.
        </p>
      )}
    </div>
  );
};
