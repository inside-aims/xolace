import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { moods, MoodType } from '@/constants/moods';

// export interface Mood {
//   id: number;
//   label: string;
//   icon: React.ReactNode;
//   color: string;
//   hoverColor: string;
// }

interface MoodSelectorProps {
  selectedMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  isTextareaFocused?: boolean;
  showTooltip?: boolean;
  onTooltipDismiss?: () => void;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * MoodSelector Component
 *
 * Interactive mood picker with tooltip guidance
 *
 * @improvements
 * 1. Extracted mood selection UI
 * 2. Animated tooltip with motion
 * 3. Accessible with proper ARIA labels
 * 4. Controlled/uncontrolled modes
 * 5. Visual feedback on selection
 */
export function MoodSelector({
  selectedMood,
  onMoodChange,
  isTextareaFocused = false,
  showTooltip = false,
  onTooltipDismiss,
  disabled = false,
  open,
  onOpenChange,
}: MoodSelectorProps) {
  const moodRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
    if (isOpen) {
      onTooltipDismiss?.();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div className="relative" ref={moodRef}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`p-0 m-0 transition-all ${
              moodRef.current
                ? ``
                : isTextareaFocused || open
                  ? `animate-[pulse_9s_ease-in-out_infinite] text-white shadow-lg`
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            onClick={onTooltipDismiss}
            disabled={disabled}
            aria-label={`Current mood: ${selectedMood.label}. Click to change mood.`}
          >
            {moodRef.current ? (
              <SelectedMoodDisplay mood={selectedMood} />
            ) : (
              selectedMood.icon
            )}
          </Button>
        </PopoverTrigger>


        {/* Animated Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <>
              {/* Main tooltip */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2"
              >
                <div className="relative rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-2 text-xs font-semibold whitespace-nowrap text-white shadow-xl">
                  <span className="relative z-10 flex items-center gap-1.5">
                    <motion.span
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      ✨
                    </motion.span>
                    Pick how you feel!
                  </span>
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-purple-400 opacity-30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-purple-500"
                    animate={{ y: [0, 2, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </motion.div>

              {/* Arrow indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="pointer-events-none absolute top-8 left-1/2 z-20 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-2xl text-purple-500"
                >
                  ↑
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <PopoverContent
        className="w-80 rounded-xl border p-4 shadow-2xl"
        align="start"
      >
        <h4 className="text-foreground mb-4 text-center font-semibold">
          How are you feeling?
        </h4>
        <div className="grid max-h-54 grid-cols-4 gap-2 overflow-y-auto lg:max-h-64">
          {moods.map(mood => (
            <button
              key={mood.id}
              type="button"
              onClick={() => onMoodChange(mood)}
              className={`rounded-xl p-3 transition-all duration-200 hover:scale-105 ${
                selectedMood.id === mood.id
                  ? `${mood.color} scale-105 text-white shadow-lg`
                  : `bg-muted hover:bg-muted/80 text-foreground ${mood.hoverColor}`
              }`}
              aria-label={`Select ${mood.label} mood`}
            >
              <div className="flex flex-col items-center gap-1">
                {mood.icon}
                <span className="text-xs font-medium">{mood.label}</span>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * SelectedMoodDisplay Component
 *
 * Shows the currently selected mood as a badge
 */
interface SelectedMoodDisplayProps {
  mood: MoodType;
}

export function SelectedMoodDisplay({ mood }: SelectedMoodDisplayProps) {
  return (
    <div className="bg-muted selected-mood flex items-center gap-2 rounded-lg px-3 py-2">
      <div className={`h-2 w-2 rounded-full ${mood.color}`}></div>
      <span className="text-muted-foreground text-sm">{mood.label}</span>
    </div>
  );
}
