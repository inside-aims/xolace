import React, { RefObject } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { AnimatePresence, motion } from 'motion/react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea
} from "@/components/ui/input-group"
import {Textarea} from "@/components/ui/textarea";

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
  actionComponents?: React.ReactNode;
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
  actionComponents,
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
              <FormControl className={"w-full grid"}>
                <InputGroup className={"relative"}>
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
                    className={`border-border min-h-[140px] resize-none rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:border-purple-400  focus:ring-0 focus-visible:ring-0 ${
                      isAnimating && 'text-transparent dark:text-transparent'
                    }`}
                    maxLength={maxChars}
                    id="tags-guide"
                    disabled={disabled || isAnimating}
                    aria-label="Post content"
                    aria-describedby="char-counter"
                  />
                  {actionComponents && (
                    <InputGroupAddon className="absolute bottom-1 right-2 left-2 z-20">
                      { actionComponents }
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </FormControl>
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
                        initial={{ y: 2, opacity: 0 }}
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
           <div className={"flex items-center justify-between"}>
             <FormMessage />
             {/* Character Counter */}
             <div
               id="char-counter"
               className="ml-auto text-muted-foreground counter text-xs"
               aria-live="polite"
             >
               {charCount}/{maxChars}
             </div>

           </div>
          </FormItem>
        );
      }}
    />
  );
}