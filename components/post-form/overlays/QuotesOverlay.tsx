// components/post-form/overlays/QuotesOverlay.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getRandomQuote, type Quote } from './strategies/quotesDatabase';
import type { MoodLoadingStrategy, LoadingStage } from '@/config/moodLoadingConfig';

interface QuotesOverlayProps {
  currentStage: LoadingStage;
  strategy: MoodLoadingStrategy;
}

/**
 * QuotesOverlay Component
 * 
 * Shows supportive, mood-appropriate quotes during loading
 * Used for reflective, sad, or contemplative moods
 */
export function QuotesOverlay({ currentStage, strategy }: QuotesOverlayProps) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Initialize with first quote
  useEffect(() => {
    if (strategy.quoteCategory) {
      setCurrentQuote(getRandomQuote(strategy.quoteCategory));
    }
  }, [strategy.quoteCategory]);

  // Rotate quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (strategy.quoteCategory) {
        setCurrentQuote(getRandomQuote(strategy.quoteCategory));
        setQuoteIndex(prev => prev + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [strategy.quoteCategory]);

  if (!currentQuote) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 px-6 py-4 max-w-lg mx-auto">
      {/* Quote Icon with gentle pulse */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="text-3xl"
      >
        <motion.span
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {currentQuote.icon}
        </motion.span>
      </motion.div>

      {/* Quote Text with fade animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <blockquote className="text-xl font-light text-white leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          
          {currentQuote.author && (
            <p className="text-sm text-white/70 italic">
              — {currentQuote.author}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Subtle progress indicator */}
      <div className="space-y-3 w-full">
        {/* <motion.div
          className="text-center text-sm text-white/80"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Creating your safe space...
        </motion.div> */}

        {/* Gentle animated line */}
        <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${strategy.color} rounded-full`}
            animate={{ 
              x: ['-100%', '100%'],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ width: '30%' }}
          />
        </div>
      </div>

      {/* Stage indicator (subtle) */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        className="text-xs text-white/60 text-center"
      >
        {currentStage === 'creating' && 'Preparing your post...'}
        {currentStage === 'analyzing' && 'Understanding your emotions...'}
        {currentStage === 'finalizing' && 'Almost ready...'}
        {currentStage === 'complete' && 'Complete ✓'}
      </motion.div> */}

      {/* Floating particles for ambiance */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div> */}
    </div>
  );
}