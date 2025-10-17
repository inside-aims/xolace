import React, { RefObject } from 'react';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CarouselEditorProps {
  slides: string[];
  currentSlide: number;
  onSlideChange: (index: number, content: string) => void;
  onNavigate: (index: number) => void;
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  canAddSlide: boolean;
  canRemoveSlide: boolean;
  canNavigateNext: boolean;
  canNavigatePrev: boolean;
  maxChars?: number;
  disabled?: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null> | null;
  canvasRef: RefObject<HTMLCanvasElement | null> | null;
  isAnimating?: boolean;
}

/**
 * CarouselEditor Component
 * 
 * Multi-slide editor with navigation and slide management
 * 
 * @improvements
 * 1. Extracted carousel UI from main form
 * 2. Slide navigation controls
 * 3. Add/remove slide functionality
 * 4. Slide indicators with progress
 * 5. Character counter per slide
 * 6. Accessible navigation
 */
export function CarouselEditor({
  slides,
  currentSlide,
  onSlideChange,
  onNavigate,
  onAddSlide,
  onRemoveSlide,
  onFocus,
  onBlur,
  canAddSlide,
  canRemoveSlide,
  canNavigateNext,
  canNavigatePrev,
  maxChars = 500,
  disabled = false,
  textareaRef,
  canvasRef,
  isAnimating = false,
}: CarouselEditorProps) {
  const currentContent = slides[currentSlide] || '';
  const charCount = currentContent.length;

  return (
    <div className="space-y-4">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigate(currentSlide - 1)}
            disabled={!canNavigatePrev || disabled}
            className="h-9 w-9 rounded-full p-0"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigate(currentSlide + 1)}
            disabled={!canNavigateNext || disabled}
            className="h-9 w-9 rounded-full p-0"
            aria-label="Next slide"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddSlide}
            disabled={!canAddSlide || disabled}
            className="h-9 w-9 rounded-full p-0"
            aria-label="Add new slide"
          >
            <Plus className="h-4 w-4" />
          </Button>
          {canRemoveSlide && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemoveSlide(currentSlide)}
              disabled={disabled}
              className="h-9 w-9 rounded-full p-0 text-red-500 hover:text-red-600"
              aria-label="Remove current slide"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={currentContent}
          onChange={(e) => onSlideChange(currentSlide, e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={`Slide ${currentSlide + 1} content... Tell part of your story here`}
          className="border-border postTextArea min-h-[140px] resize-none rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:ring-0 focus-visible:ring-0"
          maxLength={maxChars}
          id="tags-guide"
          disabled={disabled || isAnimating}
          aria-label={`Slide ${currentSlide + 1} content`}
        />
        <div className="text-muted-foreground counter absolute right-3 bottom-3 text-xs">
          {charCount}/{maxChars}
        </div>

        {/* Canvas for animation */}
        {canvasRef && (
          <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 z-10 pt-8 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 pt-2">
        {slides.map((slide, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onNavigate(index)}
            disabled={disabled}
            className={`h-3 w-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'scale-125 bg-purple-500 shadow-lg'
                : slide.trim()
                  ? 'bg-purple-200 dark:bg-purple-700'
                  : 'bg-muted'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
}