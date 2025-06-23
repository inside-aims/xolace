import React from 'react';
import { Bot, X, Minus, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  isOnline: boolean;
  onMinimize: () => void;
  onClose: () => void;
  isMinimized: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isOnline,
  onMinimize,
  onClose,
  isMinimized,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          <Circle 
            className={`absolute -bottom-1 -right-1 w-3 h-3 transition-colors duration-300 ${
              isOnline ? 'text-green-400 fill-green-400' : 'text-gray-400 fill-gray-400'
            }`} 
          />
        </div>
        <div>
          <h3 className="text-white font-semibold text-base sm:text-lg">Aniima AI</h3>
          <p className="text-purple-100 text-xs">Your mental health companion</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onMinimize}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-1 h-7 w-7 sm:h-8 sm:w-8"
        >
           <Minus className={`h-4 w-4 transition-transform duration-200 ${isMinimized ? "rotate-90" : "rotate-0"}`} />
        </Button>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-1 h-7 w-7 sm:h-8 sm:w-8"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  );
};
