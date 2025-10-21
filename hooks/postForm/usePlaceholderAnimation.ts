import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePlaceholderAnimationProps {
  placeholders: string[];
  intervalDuration?: number;
  enabled?: boolean;
}

interface UsePlaceholderAnimationReturn {
  currentPlaceholder: number;
  currentText: string;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * Custom hook to manage rotating placeholder text animation
 * 
 * Features:
 * - Automatically rotates through placeholder texts
 * - Pauses animation when tab is not visible
 * - Proper cleanup on unmount
 * - Can be paused/resumed manually
 * 
 * @improvements
 * 1. Extracted complex visibility change logic
 * 2. Proper interval cleanup (prevents memory leaks)
 * 3. Ref-based interval management (stable across renders)
 * 4. Manual pause/resume controls
 * 5. Configurable interval duration
 * 6. Type-safe implementation
 */
export function usePlaceholderAnimation({
  placeholders,
  intervalDuration = 3000,
  enabled = true,
}: UsePlaceholderAnimationProps): UsePlaceholderAnimationReturn {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  /**
   * Start the animation interval
   */
  const startAnimation = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only start if not paused and enabled
    if (isPausedRef.current || !enabled) return;

    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder(prev => (prev + 1) % placeholders.length);
    }, intervalDuration);
  }, [placeholders.length, intervalDuration, enabled]);

  /**
   * Stop the animation interval
   */
  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Pause animation manually
   */
  const pause = useCallback(() => {
    isPausedRef.current = true;
    stopAnimation();
  }, [stopAnimation]);

  /**
   * Resume animation manually
   */
  const resume = useCallback(() => {
    isPausedRef.current = false;
    startAnimation();
  }, [startAnimation]);

  /**
   * Reset to first placeholder
   */
  const reset = useCallback(() => {
    setCurrentPlaceholder(0);
    stopAnimation();
    if (!isPausedRef.current && enabled) {
      startAnimation();
    }
  }, [stopAnimation, startAnimation, enabled]);

  /**
   * Handle visibility change (pause when tab not visible)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        stopAnimation();
      } else if (!isPausedRef.current && enabled) {
        startAnimation();
      }
    };

    // Start initial animation
    if (enabled) {
      startAnimation();
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      stopAnimation();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startAnimation, stopAnimation, enabled]);

  // Get current placeholder text
  const currentText = placeholders[currentPlaceholder] || placeholders[0];

  return {
    currentPlaceholder,
    currentText,
    pause,
    resume,
    reset,
  };
}