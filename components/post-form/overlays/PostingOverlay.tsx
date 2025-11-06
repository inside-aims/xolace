'use client'

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// import { ProgressOverlay } from './ProgressOverlay';
import { ProgressToast } from './ProgressToast';
import { QuotesOverlay } from './QuotesOverlay';
import { BreathingOverlay } from './BreathingOverlay';
import { getMoodLoadingStrategy, type LoadingStage } from '@/config/moodLoadingConfig';

interface PostingOverlayProps {
  isOpen: boolean;
  moodId: string;
  currentStage: LoadingStage;
  onClose?: () => void;
  allowSkip?: boolean;
}

/**
 * PostingOverlay Component
 * 
 * Main orchestrator for adaptive loading overlays
 * Selects appropriate overlay variant based on mood
 * 
 * Features:
 * - Glass morphism backdrop
 * - Mood-adaptive content
 * - Smooth transitions
 * - Optional skip functionality
 * - Prevents interaction with background
 */
export default function PostingOverlay({
  isOpen,
  moodId,
  currentStage,
  onClose,
  allowSkip = false,
}: PostingOverlayProps) {
  const strategy = getMoodLoadingStrategy(moodId);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && allowSkip && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, allowSkip, onClose]);

  return (
    <AnimatePresence>
     {isOpen && (
        <>
          {/* Render ProgressToast without backdrop (non-blocking) */}
          {strategy.type === 'progress' && (
            <ProgressToast
              currentStage={currentStage}
              strategy={strategy}
              onDismiss={allowSkip ? onClose : undefined}
              allowDismiss={allowSkip}
            />
          )}

          {/* Render overlays with backdrop (blocking) */}
          {(strategy.type === 'quotes' || strategy.type === 'breathing') && (
            <>
              {/* Backdrop with glassmorphism */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                onClick={allowSkip ? onClose : undefined}
              >
                {/* Glass panel - Reduced size */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    relative w-full rounded-3xl overflow-hidden
                    ${strategy.type === 'quotes' ? 'max-w-lg' : 'max-w-md'}
                    bg-gradient-to-br ${strategy.color} 
                    shadow-2xl
                  `}
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(139, 92, 246, 0.9) 0%, 
                      rgba(59, 130, 246, 0.9) 100%)`,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 opacity-30">
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${strategy.color}`}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <AnimatePresence mode="wait">
                      {strategy.type === 'quotes' && (
                        <motion.div
                          key="quotes"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <QuotesOverlay
                            currentStage={currentStage}
                            strategy={strategy}
                          />
                        </motion.div>
                      )}

                      {strategy.type === 'breathing' && (
                        <motion.div
                          key="breathing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <BreathingOverlay
                            currentStage={currentStage}
                            strategy={strategy}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Decorative elements - Reduced */}
                  <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                </motion.div>
              </motion.div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook for managing posting overlay state
 */
export function usePostingOverlay() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStage, setCurrentStage] = React.useState<LoadingStage>('creating');

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const updateStage = (stage: LoadingStage) => setCurrentStage(stage);

  return {
    isOpen,
    currentStage,
    open,
    close,
    updateStage,
  };
}