import React, { RefObject } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { AnimatePresence, motion } from 'motion/react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface PostTextAreaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  textareaRef: RefObject<HTMLTextAreaElement | null> | null;
  canvasRef: RefObject<HTMLCanvasElement | null> | null;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  currentPlaceholder?: string;
  maxChars?: number;
  isAnimating?: boolean;
  disabled?: boolean;
  showCanvas?: boolean;
}

/**
 * PostTextArea Component
 * 
 * Textarea with animated placeholder, character counter, and canvas overlay
 * 
 * @improvements
 * 1. Extracted textarea with all its features
 * 2. Animated placeholder rotation
 * 3. Canvas animation overlay
 * 4. Character counter
 * 5. Type-safe with generics
 * 6. Accessible focus states
 */
export function PostTextArea<T extends FieldValues>({
  control,
  name,
  textareaRef,
  canvasRef,
  onFocus,
  onBlur,
  onChange,
  currentPlaceholder,
  maxChars = 500,
  isAnimating = false,
  disabled = false,
  showCanvas = true,
}: PostTextAreaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const charCount = field.value?.length || 0;

        return (
          <FormItem>
            <div className="postTextArea relative">
              <FormControl>
                <Textarea
                  {...field}
                  ref={textareaRef}
                  onFocus={() => {
                    onFocus?.();
                  }}
                  onBlur={() => {
                    onBlur?.();
                  }}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    field.onChange(e);
                    onChange?.(e.target.value);
                  }}
                  className={`border-border min-h-[140px] resize-none rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:border-purple-400 focus:ring-0 focus-visible:ring-0 ${
                    isAnimating && 'text-transparent dark:text-transparent'
                  }`}
                  maxLength={maxChars}
                  id="tags-guide"
                  disabled={disabled || isAnimating}
                  aria-label="Post content"
                  aria-describedby="char-counter"
                />
              </FormControl>

              {/* Character Counter */}
              <div
                id="char-counter"
                className="text-muted-foreground counter absolute right-3 bottom-3 text-xs"
                aria-live="polite"
              >
                {charCount}/{maxChars}
              </div>

              {/* Canvas for animation */}
              {showCanvas && (
                <canvas
                  ref={canvasRef}
                  className={`pointer-events-none absolute inset-0 z-10 pt-8 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Animated Placeholder */}
              {currentPlaceholder !== undefined && (
                <div className="pointer-events-none absolute inset-0 flex items-center rounded-md">
                  <AnimatePresence mode="wait">
                    {!field.value && (
                      <motion.p
                        initial={{ y: 5, opacity: 0 }}
                        key={`placeholder-${currentPlaceholder}`}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'linear' }}
                        className="w-[calc(100%-2rem)] truncate pl-4 text-left text-sm font-normal text-neutral-500 sm:pl-12 sm:text-base dark:text-zinc-500"
                      >
                        {currentPlaceholder}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}