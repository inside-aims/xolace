import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isOnline: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isOnline,
}) => {
  return (
    <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts..."
          className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm"
          disabled={!isOnline}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-shrink-0"
          disabled={!isOnline || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
      {!isOnline && (
        <p className="text-xs text-red-500 mt-2">
          You&apos;re currently offline. Please check your connection.
        </p>
      )}
    </div>
  );
};
