// components/post-form/overlays/strategies/moodLoadingConfig.ts

export type LoadingVariant = 'progress' | 'quotes' | 'breathing';
export type BreathingTechnique = 'box' | '4-7-8' | 'simple';
export type LoadingStage = 'creating' | 'analyzing' | 'finalizing' | 'complete';

export interface MoodLoadingStrategy {
  type: LoadingVariant;
  theme: string;
  color: string;
  animation?: 'pulse' | 'wave' | 'gentle' | 'energetic';
  
  // For progress variant
  showStages?: boolean;
  
  // For quotes variant
  quoteCategory?: 'empathetic' | 'understanding' | 'supportive' | 'contemplative' | 'encouraging';
  
  // For breathing variant
  breathingTechnique?: BreathingTechnique;
  breathingDuration?: number; // seconds per cycle
}

/**
 * Mood-based loading strategy configuration
 * 
 * Maps each mood to an appropriate loading experience:
 * - High energy moods → Progress indicators
 * - Low energy/sad moods → Supportive quotes
 * - Stressed/anxious moods → Breathing exercises
 */
export const MOOD_LOADING_STRATEGIES: Record<string, MoodLoadingStrategy> = {
  // HIGH ENERGY / POSITIVE MOODS - Progress Indicators
  excited: {
    type: 'progress',
    theme: 'energetic',
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    animation: 'energetic',
    showStages: true,
  },
  
  happy: {
    type: 'progress',
    theme: 'cheerful',
    color: 'bg-gradient-to-r from-green-400 to-emerald-500',
    animation: 'wave',
    showStages: true,
  },
  
  grateful: {
    type: 'progress',
    theme: 'warm',
    color: 'bg-gradient-to-r from-orange-400 to-pink-500',
    animation: 'gentle',
    showStages: true,
  },
  
  motivated: {
    type: 'progress',
    theme: 'dynamic',
    color: 'bg-gradient-to-r from-blue-500 to-purple-500',
    animation: 'energetic',
    showStages: true,
  },
  
  inspired: {
    type: 'progress',
    theme: 'creative',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    animation: 'wave',
    showStages: true,
  },
  
  energetic: {
    type: 'progress',
    theme: 'vibrant',
    color: 'bg-gradient-to-r from-red-400 to-yellow-500',
    animation: 'energetic',
    showStages: true,
  },
  
  // LOW ENERGY / REFLECTIVE MOODS - Supportive Quotes
  sad: {
    type: 'quotes',
    theme: 'comforting',
    color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    animation: 'gentle',
    quoteCategory: 'empathetic',
  },
  
  melancholy: {
    type: 'quotes',
    theme: 'gentle',
    color: 'bg-gradient-to-r from-slate-400 to-blue-400',
    animation: 'gentle',
    quoteCategory: 'understanding',
  },
  
  confused: {
    type: 'quotes',
    theme: 'clarifying',
    color: 'bg-gradient-to-r from-purple-400 to-blue-400',
    animation: 'gentle',
    quoteCategory: 'supportive',
  },
  
  thoughtful: {
    type: 'quotes',
    theme: 'reflective',
    color: 'bg-gradient-to-r from-indigo-400 to-purple-400',
    animation: 'gentle',
    quoteCategory: 'contemplative',
  },
  
  nostalgic: {
    type: 'quotes',
    theme: 'warm',
    color: 'bg-gradient-to-r from-amber-400 to-orange-400',
    animation: 'gentle',
    quoteCategory: 'understanding',
  },
  
  // STRESSED / ANXIOUS MOODS - Breathing Exercises
  angry: {
    type: 'breathing',
    theme: 'calming',
    color: 'bg-gradient-to-r from-red-400 to-orange-400',
    animation: 'gentle',
    breathingTechnique: '4-7-8',
    breathingDuration: 4,
  },
  
  // NEUTRAL / DEFAULT
  neutral: {
    type: 'progress',
    theme: 'minimal',
    color: 'bg-gradient-to-r from-gray-400 to-slate-500',
    animation: 'gentle',
    showStages: true,
  },
  
  chill: {
    type: 'progress',
    theme: 'relaxed',
    color: 'bg-gradient-to-r from-teal-400 to-cyan-500',
    animation: 'gentle',
    showStages: true,
  },
  
  peaceful: {
    type: 'breathing',
    theme: 'serene',
    color: 'bg-gradient-to-r from-blue-300 to-teal-400',
    animation: 'gentle',
    breathingTechnique: 'simple',
    breathingDuration: 3,
  },
  
  creative: {
    type: 'progress',
    theme: 'imaginative',
    color: 'bg-gradient-to-r from-fuchsia-400 to-purple-500',
    animation: 'wave',
    showStages: true,
  },
  
  laughing: {
    type: 'progress',
    theme: 'joyful',
    color: 'bg-gradient-to-r from-yellow-300 to-green-400',
    animation: 'energetic',
    showStages: true,
  },
};

/**
 * Get loading strategy for a mood, with fallback to neutral
 */
export function getMoodLoadingStrategy(moodId: string): MoodLoadingStrategy {
  return MOOD_LOADING_STRATEGIES[moodId] || MOOD_LOADING_STRATEGIES.neutral;
}

/**
 * Loading stage configuration
 */
export interface StageConfig {
  id: LoadingStage;
  label: string;
  icon: string;
  estimatedDuration: number; // milliseconds
}

export const LOADING_STAGES: StageConfig[] = [
  {
    id: 'creating',
    label: 'Creating your post...',
    icon: '✍️',
    estimatedDuration: 1000,
  },
  {
    id: 'analyzing',
    label: 'AI analyzing emotions...',
    icon: '🧠',
    estimatedDuration: 3000,
  },
  {
    id: 'finalizing',
    label: 'Adding supportive message...',
    icon: '💬',
    estimatedDuration: 1000,
  },
  {
    id: 'complete',
    label: 'Complete!',
    icon: '✅',
    estimatedDuration: 500,
  },
];

/**
 * Get total estimated duration
 */
export function getTotalEstimatedDuration(): number {
  return LOADING_STAGES.reduce((total, stage) => total + stage.estimatedDuration, 0);
}

/**
 * Get progress percentage for current stage
 */
export function getStageProgress(currentStage: LoadingStage): number {
  const currentIndex = LOADING_STAGES.findIndex(s => s.id === currentStage);
  if (currentIndex === -1) return 0;
  
  const completedDuration = LOADING_STAGES
    .slice(0, currentIndex)
    .reduce((total, stage) => total + stage.estimatedDuration, 0);
  
  const totalDuration = getTotalEstimatedDuration();
  
  return Math.round((completedDuration / totalDuration) * 100);
}