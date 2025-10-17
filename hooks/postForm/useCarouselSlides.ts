import { useState, useCallback, useMemo } from 'react';

const MIN_SLIDES = 1;
const MAX_SLIDES = 10;

interface UseCarouselSlidesReturn {
  slides: string[];
  currentSlide: number;
  canAddSlide: boolean;
  canRemoveSlide: boolean;
  canNavigateNext: boolean;
  canNavigatePrev: boolean;
  addSlide: () => void;
  removeSlide: (index: number) => void;
  updateSlide: (index: number, content: string) => void;
  navigateToSlide: (index: number) => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  resetSlides: () => void;
  getSlideStats: () => SlideStats;
}

interface SlideStats {
  total: number;
  filled: number;
  empty: number;
  currentIndex: number;
}

/**
 * Custom hook to manage carousel slides state and operations
 * 
 * Features:
 * - Add/remove/update slides
 * - Navigate between slides
 * - Validate slide operations
 * - Track slide statistics
 * - Automatic current slide adjustment on deletion
 * 
 * @improvements
 * 1. Centralized carousel logic (was scattered in component)
 * 2. Added operation validation (canAdd, canRemove, canNavigate)
 * 3. Safe navigation with bounds checking
 * 4. Slide statistics for UI feedback
 * 5. Immutable state updates
 * 6. Better edge case handling
 * 7. Type-safe operations
 */
export function useCarouselSlides(initialSlide: string = ''): UseCarouselSlidesReturn {
  const [slides, setSlides] = useState<string[]>([initialSlide]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Computed state for UI controls
  const canAddSlide = useMemo(() => slides.length < MAX_SLIDES, [slides.length]);
  const canRemoveSlide = useMemo(() => slides.length > MIN_SLIDES, [slides.length]);
  const canNavigateNext = useMemo(() => currentSlide < slides.length - 1, [currentSlide, slides.length]);
  const canNavigatePrev = useMemo(() => currentSlide > 0, [currentSlide]);

  /**
   * Add a new empty slide and navigate to it
   */
  const addSlide = useCallback(() => {
    if (!canAddSlide) return;

    setSlides(prev => [...prev, '']);
    setCurrentSlide(slides.length); // Navigate to new slide
  }, [canAddSlide, slides.length]);

  /**
   * Remove a slide by index with safe current slide adjustment
   */
  const removeSlide = useCallback((index: number) => {
    if (!canRemoveSlide) return;
    if (index < 0 || index >= slides.length) return; // Bounds check

    setSlides(prev => prev.filter((_, i) => i !== index));

    // Adjust current slide if necessary
    setCurrentSlide(prev => {
      if (prev >= slides.length - 1) {
        return Math.max(0, slides.length - 2); // Move to last remaining slide
      }
      if (prev > index) {
        return prev - 1; // Shift back if we deleted before current
      }
      return prev;
    });
  }, [canRemoveSlide, slides.length]);

  /**
   * Update content of a specific slide
   */
  const updateSlide = useCallback((index: number, content: string) => {
    if (index < 0 || index >= slides.length) return; // Bounds check

    setSlides(prev => {
      const newSlides = [...prev];
      newSlides[index] = content;
      return newSlides;
    });
  }, [slides.length]);

  /**
   * Navigate to a specific slide with bounds checking
   */
  const navigateToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, [slides.length]);

  /**
   * Navigate to next slide
   */
  const navigateNext = useCallback(() => {
    if (canNavigateNext) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [canNavigateNext]);

  /**
   * Navigate to previous slide
   */
  const navigatePrev = useCallback(() => {
    if (canNavigatePrev) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [canNavigatePrev]);

  /**
   * Reset slides to initial state
   */
  const resetSlides = useCallback(() => {
    setSlides([initialSlide]);
    setCurrentSlide(0);
  }, [initialSlide]);

  /**
   * Get statistics about slides
   */
  const getSlideStats = useCallback((): SlideStats => {
    const filled = slides.filter(slide => slide.trim().length > 0).length;
    
    return {
      total: slides.length,
      filled,
      empty: slides.length - filled,
      currentIndex: currentSlide,
    };
  }, [slides, currentSlide]);

  return useMemo(
    () => ({
      slides,
      currentSlide,
      canAddSlide,
      canRemoveSlide,
      canNavigateNext,
      canNavigatePrev,
      addSlide,
      removeSlide,
      updateSlide,
      navigateToSlide,
      navigateNext,
      navigatePrev,
      resetSlides,
      getSlideStats,
    }),
    [
      slides,
      currentSlide,
      canAddSlide,
      canRemoveSlide,
      canNavigateNext,
      canNavigatePrev,
      addSlide,
      removeSlide,
      updateSlide,
      navigateToSlide,
      navigateNext,
      navigatePrev,
      resetSlides,
      getSlideStats,
    ]
  );
}

/**
 * Utility: Check if carousel has any content
 */
export function hasCarouselContent(slides: string[]): boolean {
  return slides.some(slide => slide.trim().length > 0);
}

/**
 * Utility: Get first non-empty slide
 */
export function getFirstNonEmptySlide(slides: string[]): string | null {
  return slides.find(slide => slide.trim().length > 0) || null;
}