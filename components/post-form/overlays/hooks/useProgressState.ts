// components/post-form/overlays/hooks/useProgressState.ts

import { useState, useEffect } from 'react';
import { 
  LOADING_STAGES, 
  getStageProgress, 
  type LoadingStage 
} from '@/config/moodLoadingConfig';

interface UseProgressStateReturn {
  displayedProgress: number;
  targetProgress: number;
  currentStageConfig: typeof LOADING_STAGES[0] | undefined;
  allStages: typeof LOADING_STAGES;
  isStageComplete: (stageId: LoadingStage) => boolean;
  isCurrentStage: (stageId: LoadingStage) => boolean;
}

/**
 * Shared hook for progress state management
 * 
 * Handles:
 * - Progress calculation
 * - Smooth progress animation
 * - Stage tracking
 * - Stage completion status
 * 
 * Can be used by both ProgressOverlay and ProgressToast
 */
export function useProgressState(currentStage: LoadingStage): UseProgressStateReturn {
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

  // Check if a stage is complete
  const isStageComplete = (stageId: LoadingStage): boolean => {
    const currentIndex = LOADING_STAGES.findIndex(s => s.id === currentStage);
    const checkIndex = LOADING_STAGES.findIndex(s => s.id === stageId);
    return checkIndex < currentIndex;
  };

  // Check if a stage is current
  const isCurrentStage = (stageId: LoadingStage): boolean => {
    return stageId === currentStage;
  };

  return {
    displayedProgress,
    targetProgress,
    currentStageConfig,
    allStages: LOADING_STAGES,
    isStageComplete,
    isCurrentStage,
  };
}