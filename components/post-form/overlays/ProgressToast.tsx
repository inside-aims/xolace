// components/post-form/overlays/ProgressToast.tsx

import React from 'react';
import { motion } from 'motion/react';
import { useProgressState } from './hooks/useProgressState';
import type { LoadingStage, MoodLoadingStrategy } from '@/config/moodLoadingConfig';
import { X } from 'lucide-react';

interface ProgressToastProps {
  currentStage: LoadingStage;
  strategy: MoodLoadingStrategy;
  onDismiss?: () => void;
  allowDismiss?: boolean;
}

/**
 * ProgressToast Component
 * 
 * Compact toast-style progress indicator for high-energy moods
 * 
 * Features:
 * - Top-center positioning
 * - Minimal height (80px)
 * - Inline stage indicators
 * - Optional dismiss button
 * - Glass morphism styling
 * - Doesn't block interaction
 * 
 * @improvements
 * 1. Significantly less intrusive than overlay
 * 2. Allows browsing during post creation
 * 3. Clean, modern design
 * 4. Mood-based color theming
 */
export function ProgressToast({
  currentStage,
  strategy,
  onDismiss,
  allowDismiss = false,
}: ProgressToastProps) {
  const {
    displayedProgress,
    currentStageConfig,
    allStages,
    isStageComplete,
    isCurrentStage,
  } = useProgressState(currentStage);

  // Filter out 'complete' stage for display
  const displayStages = allStages.filter(s => s.id !== 'complete');

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Gradient accent bar */}
        <div className={`h-1 ${strategy.color}`} />

        {/* Main content */}
        <div className="p-4">
          {/* Top row: Icon + Label + Dismiss */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Current stage icon */}
              <motion.div
                className="text-2xl"
                animate={{
                  rotate: strategy.animation === 'energetic' ? [0, 5, -5, 0] : 0,
                  scale: strategy.animation === 'energetic' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {currentStageConfig?.icon}
              </motion.div>

              {/* Stage label */}
              <div>
                <motion.h4
                  key={currentStage}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-semibold text-gray-900"
                >
                  {currentStageConfig?.label}
                </motion.h4>
                <p className="text-xs text-gray-600">
                  Your post is being crafted
                </p>
              </div>
            </div>

            {/* Dismiss button */}
            {allowDismiss && onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Progress percentage */}
            <div className="text-sm font-bold text-gray-900">
              {displayedProgress}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <motion.div
              className={`h-full ${strategy.color} rounded-full`}
              initial={{ width: '0%' }}
              animate={{ width: `${displayedProgress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />

            {/* Shine effect for energetic moods */}
            {strategy.animation === 'energetic' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>

          {/* Stage indicators */}
          <div className="flex items-center justify-between">
            {displayStages.map((stage) => {
              const isComplete = isStageComplete(stage.id);
              const isCurrent = isCurrentStage(stage.id);

              return (
                <div
                  key={stage.id}
                  className="flex items-center gap-2"
                >
                  {/* Stage icon/checkmark */}
                  <motion.div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                      isComplete
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? `${strategy.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')} text-white`
                          : 'bg-gray-200 text-gray-400'
                    }`}
                    animate={{
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isCurrent ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  >
                    {isComplete ? '✓' : stage.icon}
                  </motion.div>

                  {/* Stage label (hidden on mobile) */}
                  <span
                    className={`text-xs hidden sm:inline ${
                      isCurrent
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {stage.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle pulsing border for current stage */}
        {strategy.animation === 'pulse' && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: '2px solid rgba(139, 92, 246, 0.3)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}