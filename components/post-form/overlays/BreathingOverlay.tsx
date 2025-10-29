// components/post-form/overlays/BreathingOverlay.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  getBreathingPattern, 
  getCurrentBreathingStep,
  getBreathingScale,
  getPhaseColor,
  type BreathingPattern 
} from './strategies/breathingPatterns';
import type { MoodLoadingStrategy, LoadingStage } from '@/config/moodLoadingConfig';

interface BreathingOverlayProps {
  currentStage: LoadingStage;
  strategy: MoodLoadingStrategy;
}

/**
 * BreathingOverlay Component
 * 
 * Interactive breathing exercise during post creation
 * Used for anxious, stressed, or overwhelmed moods
 */
export function BreathingOverlay({ currentStage, strategy }: BreathingOverlayProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pattern, setPattern] = useState<BreathingPattern | null>(null);

  // Initialize breathing pattern
  useEffect(() => {
    if (strategy.breathingTechnique) {
      setPattern(getBreathingPattern(strategy.breathingTechnique));
    }
  }, [strategy.breathingTechnique]);

  // Timer for breathing cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!pattern) return null;

  const { step, progress } = getCurrentBreathingStep(pattern, elapsedSeconds);
  const scale = getBreathingScale(step, progress);
  const phaseColor = getPhaseColor(step.phase);

  // Calculate countdown for current step
  const remainingTime = Math.ceil(step.duration - (step.duration * progress));

  return (
    <div className="flex flex-col items-center justify-center space-y-6 px-6 py-6">
      {/* Pattern Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="text-2xl mb-2">{pattern.icon}</div>
        <h3 className="text-xl font-semibold text-white">
          {pattern.name}
        </h3>
        <p className="text-sm text-white/70">
          {pattern.description}
        </p>
      </motion.div>

      {/* Breathing Circle */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Outer glow rings */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColor} opacity-20 blur-2xl`}
          animate={{
            scale: scale * 1.2,
          }}
          transition={{
            duration: step.duration,
            ease: 'easeInOut',
          }}
        />

        {/* Middle ring */}
        <motion.div
          className={`absolute w-44 h-44 rounded-full bg-gradient-to-br ${phaseColor} opacity-30`}
          animate={{
            scale: scale,
          }}
          transition={{
            duration: step.duration,
            ease: 'easeInOut',
          }}
        />

        {/* Inner breathing circle */}
        <motion.div
          className={`absolute w-28 h-28 rounded-full bg-gradient-to-br ${phaseColor} flex items-center justify-center shadow-2xl`}
          animate={{
            scale: scale,
          }}
          transition={{
            duration: step.duration,
            ease: 'easeInOut',
          }}
        >
          {/* Countdown number */}
          <motion.div
            className="text-3xl font-bold text-white"
            key={`${step.phase}-${remainingTime}`}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {remainingTime}
          </motion.div>
        </motion.div>

        {/* Pulse effect on inhale */}
        {step.phase === 'inhale' && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColor}`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </div>

      {/* Instruction Text */}
      <motion.div
        key={step.instruction}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <p className="text-xl font-light text-white">
          {step.instruction}
        </p>
        <p className="text-sm text-white/60 capitalize">
          {step.phase.replace('_', ' ')}
        </p>
      </motion.div>

      {/* Progress indicator */}
      {/* <div className="space-y-2 w-full max-w-xs">
        <div className="flex justify-between text-xs text-white/60">
          <span>Cycle {Math.floor(elapsedSeconds / pattern.totalCycleDuration) + 1}</span>
          <span>{pattern.benefits}</span>
        </div>
        

        <motion.div
          className="text-center text-xs text-white/50"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Your post is being created in the background...
        </motion.div>
      </div> */}

      {/* Phase indicators */}
      <div className="flex space-x-2">
        {pattern.steps.map((s, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              s.phase === step.phase ? 'bg-white' : 'bg-white/30'
            }`}
            animate={{
              scale: s.phase === step.phase ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: s.phase === step.phase ? Infinity : 0,
            }}
          />
        ))}
      </div>

      {/* Skip option (subtle) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        whileHover={{ opacity: 1 }}
        onClick={() => {/* Could add skip functionality */}}
        className="text-xs text-white/50 hover:text-white/80 transition-colors underline"
      >
        Continue without exercise
      </motion.button>
    </div>
  );
}