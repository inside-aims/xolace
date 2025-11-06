// components/post-form/overlays/ProgressOverlay.tsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LOADING_STAGES, 
  getStageProgress, 
  type LoadingStage,
  type MoodLoadingStrategy 
} from '@/config/moodLoadingConfig';

interface ProgressOverlayProps {
  currentStage: LoadingStage;
  strategy: MoodLoadingStrategy;
}

/**
 * ProgressOverlay Component
 * 
 * Shows multi-stage progress indicator with mood-based styling
 * Used for high-energy and positive moods
 */
export function ProgressOverlay({ currentStage, strategy }: ProgressOverlayProps) {
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const targetProgress = getStageProgress(currentStage);
  const currentStageConfig = LOADING_STAGES.find(s => s.id === currentStage);

  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedProgress(prev => {
        if (prev < targetProgress) {
          return Math.min(prev + 1, targetProgress);
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [targetProgress]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      {/* Main Icon/Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl"
      >
        {currentStageConfig?.icon}
      </motion.div>

      {/* Stage Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            {currentStageConfig?.label}
          </h3>
          <p className="text-sm text-white/80">
            Your post is being crafted with care
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      {strategy.showStages && (
        <div className="w-full max-w-md space-y-3">
          {/* Main progress bar */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className={`h-full ${strategy.color} rounded-full`}
              initial={{ width: '0%' }}
              animate={{ width: `${displayedProgress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            
            {/* Animated shine effect */}
            {strategy.animation === 'energetic' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>

          {/* Percentage */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/80">{displayedProgress}%</span>
            <span className="text-white/60">Almost there...</span>
          </div>

          {/* Stage indicators */}
          <div className="flex justify-between items-center pt-4">
            {LOADING_STAGES.filter(s => s.id !== 'complete').map((stage, index) => {
              const isComplete = LOADING_STAGES.findIndex(s => s.id === currentStage) > index;
              const isCurrent = stage.id === currentStage;

              return (
                <div key={stage.id} className="flex flex-col items-center space-y-2">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                      isComplete || isCurrent
                        ? 'bg-white text-purple-600'
                        : 'bg-white/20 text-white/40'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                      rotate: isCurrent ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{ 
                      duration: isCurrent ? 0.5 : 0.3,
                      repeat: isCurrent ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  >
                    {isComplete ? '✓' : stage.icon}
                  </motion.div>
                  <span className={`text-xs ${isCurrent ? 'text-white' : 'text-white/60'}`}>
                    {stage.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Animated dots for "processing" feel */}
      <motion.div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-white/60 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}