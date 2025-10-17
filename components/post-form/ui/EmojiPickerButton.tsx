import React, { RefObject } from 'react';
import dynamic from 'next/dynamic';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Dynamic import for emoji picker
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => <p className="p-4">Loading emojis...</p>,
});

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  textareaRef?: RefObject<HTMLTextAreaElement>;
}

interface EmojiData {
  emoji: string;
}

/**
 * EmojiPickerButton Component
 * 
 * Button with popover containing emoji picker
 * 
 * @improvements
 * 1. Extracted emoji picker logic
 * 2. Dynamic import for code splitting
 * 3. Proper TypeScript types
 * 4. Accessible with ARIA labels
 * 5. Loading state
 */
export function EmojiPickerButton({
  onEmojiSelect,
  disabled = false,
  open,
  onOpenChange,
}: EmojiPickerButtonProps) {
  const handleEmojiClick = (emojiData: EmojiData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label="Open emoji picker"
          id="emoji-btn"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width="100%"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          theme={'auto' as any}
          height={370}
          searchDisabled
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          emojiStyle={'apple' as any}
          lazyLoadEmojis
        />
      </PopoverContent>
    </Popover>
  );
}