// components/post-form/overlays/strategies/breathingPatterns.ts

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export interface BreathingStep {
  phase: BreathingPhase;
  duration: number; // seconds
  instruction: string;
  scale: number; // Circle scale (1.0 to 1.5)
}

export interface BreathingPattern {
  name: string;
  description: string;
  icon: string;
  steps: BreathingStep[];
  benefits: string;
  totalCycleDuration: number; // seconds
}

/**
 * Breathing exercise patterns for stress/anxiety relief
 */
export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  // Box Breathing (4-4-4-4)
  box: {
    name: 'Box Breathing',
    description: 'Equal breathing pattern used by Navy SEALs',
    icon: '⬜',
    benefits: 'Reduces stress and improves focus',
    totalCycleDuration: 16,
    steps: [
      {
        phase: 'inhale',
        duration: 4,
        instruction: 'Breathe in gently...',
        scale: 1.5,
      },
      {
        phase: 'hold',
        duration: 4,
        instruction: 'Hold your breath...',
        scale: 1.5,
      },
      {
        phase: 'exhale',
        duration: 4,
        instruction: 'Breathe out slowly...',
        scale: 1.0,
      },
      {
        phase: 'pause',
        duration: 4,
        instruction: 'Pause before next breath...',
        scale: 1.0,
      },
    ],
  },

  // 4-7-8 Breathing (Relaxing Breath)
  '4-7-8': {
    name: '4-7-8 Breathing',
    description: 'Natural tranquilizer for the nervous system',
    icon: '🌙',
    benefits: 'Promotes deep relaxation and sleep',
    totalCycleDuration: 19,
    steps: [
      {
        phase: 'inhale',
        duration: 4,
        instruction: 'Breathe in through your nose...',
        scale: 1.5,
      },
      {
        phase: 'hold',
        duration: 7,
        instruction: 'Hold your breath gently...',
        scale: 1.5,
      },
      {
        phase: 'exhale',
        duration: 8,
        instruction: 'Exhale completely through your mouth...',
        scale: 1.0,
      },
    ],
  },

  // Simple Breathing (Even breathing)
  simple: {
    name: 'Calm Breathing',
    description: 'Simple, gentle breathing for immediate calm',
    icon: '🫁',
    benefits: 'Quick stress relief, easy to practice anywhere',
    totalCycleDuration: 10,
    steps: [
      {
        phase: 'inhale',
        duration: 4,
        instruction: 'Breathe in...',
        scale: 1.4,
      },
      {
        phase: 'hold',
        duration: 2,
        instruction: 'Hold...',
        scale: 1.4,
      },
      {
        phase: 'exhale',
        duration: 4,
        instruction: 'Breathe out...',
        scale: 1.0,
      },
    ],
  },
};

/**
 * Get breathing pattern by technique name
 */
export function getBreathingPattern(technique: string): BreathingPattern {
  return BREATHING_PATTERNS[technique] || BREATHING_PATTERNS.simple;
}

/**
 * Get current step based on elapsed time in cycle
 */
export function getCurrentBreathingStep(
  pattern: BreathingPattern,
  elapsedSeconds: number
): { step: BreathingStep; stepIndex: number; progress: number } {
  const cycleTime = elapsedSeconds % pattern.totalCycleDuration;
  let accumulatedTime = 0;

  for (let i = 0; i < pattern.steps.length; i++) {
    const step = pattern.steps[i];
    if (cycleTime < accumulatedTime + step.duration) {
      const stepProgress = (cycleTime - accumulatedTime) / step.duration;
      return {
        step,
        stepIndex: i,
        progress: stepProgress,
      };
    }
    accumulatedTime += step.duration;
  }

  // Fallback to first step
  return {
    step: pattern.steps[0],
    stepIndex: 0,
    progress: 0,
  };
}

/**
 * Get animation scale value for current breathing phase
 */
export function getBreathingScale(
  step: BreathingStep,
  progress: number
): number {
  const { phase, scale } = step;

  switch (phase) {
    case 'inhale':
      // Smoothly grow from 1.0 to target scale
      return 1.0 + (scale - 1.0) * easeInOut(progress);
    
    case 'hold':
      // Stay at target scale
      return scale;
    
    case 'exhale':
      // Smoothly shrink from current scale to 1.0
      return scale - (scale - 1.0) * easeInOut(progress);
    
    case 'pause':
      // Stay at 1.0
      return 1.0;
    
    default:
      return 1.0;
  }
}

/**
 * Easing function for smooth animations
 */
function easeInOut(t: number): number {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
}

/**
 * Get color for breathing phase
 */
export function getPhaseColor(phase: BreathingPhase): string {
  switch (phase) {
    case 'inhale':
      return 'from-blue-400 to-cyan-400';
    case 'hold':
      return 'from-purple-400 to-blue-400';
    case 'exhale':
      return 'from-green-400 to-teal-400';
    case 'pause':
      return 'from-gray-400 to-slate-400';
    default:
      return 'from-blue-400 to-purple-400';
  }
}