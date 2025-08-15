// components/ui/onboarding-tooltip.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingTooltipProps {
  id: string;
  children: React.ReactNode;
  content: {
    title: string;
    description: string;
  };
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

// Simple localStorage wrapper that handles SSR
const getOnboardingState = (id: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`onboarding-${id}`) === 'true';
  } catch {
    return false;
  }
};

const setOnboardingState = (id: string, dismissed: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`onboarding-${id}`, dismissed.toString());
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  id,
  children,
  content,
  position = 'top',
  className = '',
}) => {
  const [isDismissed, setIsDismissed] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = getOnboardingState(id);
    setIsDismissed(dismissed);
    
    // Show tooltip after a short delay if not dismissed
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    setOnboardingState(id, true);
  };

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-slate-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-slate-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-slate-800',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      
      {!isDismissed && isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-in fade-in duration-300`}
        >
          <div className="bg-slate-800 text-white p-4 rounded-lg shadow-lg max-w-xs border border-slate-700">
            {/* Arrow */}
            <div className={`absolute w-0 h-0 ${arrowClasses[position]}`}></div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{content.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {content.description}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 h-auto text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook to reset all onboarding tooltips (useful for development/testing)
export const useResetOnboarding = () => {
  const resetOnboarding = () => {
    if (typeof window === 'undefined') return;
    
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('onboarding-'))
        .forEach(key => localStorage.removeItem(key));
    } catch {
      // Silently fail
    }
  };

  return resetOnboarding;
};