import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Slide {
  content: string;
  slide_index: number;
}

interface SimpleCarouselPostProps {
  slides: Slide[];
  onClick?: () => void;
}

const SimpleCarouselPost = ({ slides, onClick }: SimpleCarouselPostProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigateSlide = (direction: 'prev' | 'next') => {
    setCurrentSlide(prev => {
      if (direction === 'prev' && prev > 0) {
        return prev - 1;
      } else if (direction === 'next' && prev < slides.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* Carousel Navigation */}
      {slides.length > 1 && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateSlide('prev')}
              disabled={currentSlide === 0}
              className="h-8 w-8 rounded-full p-0"
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <span className="text-muted-foreground px-2 text-sm">
              {currentSlide + 1} / {slides.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateSlide('next')}
              disabled={currentSlide === slides.length - 1}
              className="h-8 w-8 rounded-full p-0"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Carousel Content */}
      <div className="mb-3 cursor-pointer" onClick={onClick}>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-content-label">
          {slides[currentSlide]?.content || ''}
        </p>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide ? 'scale-125 bg-purple-500' : 'bg-muted'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleCarouselPost;
