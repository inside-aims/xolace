import { useState, useEffect, useRef, useCallback } from 'react';

interface UseMoodTooltipProps {
  hasContent: boolean;
  maxShowCount?: number;
  initialDelay?: number;
  showDuration?: number;
  repeatDelay?: number;
}

interface UseMoodTooltipReturn {
  showTooltip: boolean;
  tooltipShowCount: number;
  markAsSelected: () => void;
  resetTooltip: () => void;
}

/**
 * Custom hook to manage mood selector tooltip display logic
 * 
 * Features:
 * - Shows tooltip when user starts typing
 * - Auto-hides after duration
 * - Limits number of times shown
 * - Stops showing after user selects mood
 * - Configurable timing
 * 
 * @improvements
 * 1. Extracted complex timer logic from component
 * 2. Proper timer cleanup (prevents memory leaks)
 * 3. Ref-based state management for timers
 * 4. Configurable timing parameters
 * 5. Clear state management
 * 6. Easy to test independently
 */
export function useMoodTooltip({
  hasContent,
  maxShowCount = 3,
  initialDelay = 1000,
  showDuration = 4000,
  repeatDelay = 50000,
}: UseMoodTooltipProps): UseMoodTooltipReturn {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipShowCount, setTooltipShowCount] = useState(0);
  const [userHasSelected, setUserHasSelected] = useState(false);

  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear all active timers
   */
  const clearAllTimers = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, []);

  /**
   * Show tooltip with auto-hide
   */
  const showTooltipWithTimer = useCallback((count: number) => {
    // Don't show if conditions not met
    if (userHasSelected || count >= maxShowCount || !hasContent) {
      return;
    }

    // Show tooltip
    setShowTooltip(true);
    setTooltipShowCount(prev => prev + 1);

    // Hide after duration
    hideTimerRef.current = setTimeout(() => {
      setShowTooltip(false);

      // Schedule next show if not at limit
      if (count + 1 < maxShowCount && !userHasSelected) {
        showTimerRef.current = setTimeout(() => {
          showTooltipWithTimer(count + 1);
        }, repeatDelay);
      }
    }, showDuration);
  }, [userHasSelected, maxShowCount, hasContent, showDuration, repeatDelay]);

  /**
   * Mark mood as selected (stops showing tooltip)
   */
  const markAsSelected = useCallback(() => {
    setUserHasSelected(true);
    setShowTooltip(false);
    clearAllTimers();
  }, [clearAllTimers]);

  /**
   * Reset tooltip state
   */
  const resetTooltip = useCallback(() => {
    setUserHasSelected(false);
    setTooltipShowCount(0);
    setShowTooltip(false);
    clearAllTimers();
  }, [clearAllTimers]);

  /**
   * Watch for content changes and trigger tooltip
   */
  useEffect(() => {
    // Don't show if already selected or at limit
    if (userHasSelected || tooltipShowCount >= maxShowCount) {
      return;
    }

    // Clear existing typing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // If no content, hide tooltip
    if (!hasContent) {
      setShowTooltip(false);
      clearAllTimers();
      return;
    }

    // Start initial delay timer after user starts typing
    typingTimerRef.current = setTimeout(() => {
      showTooltipWithTimer(tooltipShowCount);
    }, initialDelay);

    // Cleanup on unmount or dependency change
    return () => {
      clearAllTimers();
    };
  }, [
    hasContent,
    userHasSelected,
    tooltipShowCount,
    maxShowCount,
    initialDelay,
    showTooltipWithTimer,
    clearAllTimers,
  ]);

  return {
    showTooltip,
    tooltipShowCount,
    markAsSelected,
    resetTooltip,
  };
}