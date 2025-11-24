import React from 'react';
import { Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { DefaultLoader } from '@/components/shared/loaders/DefaultLoader';

const ShinyButton = dynamic(() => import('@/components/ui/shiny-button'), {
  ssr: false,
  loading: () => (
    <Button disabled className="rounded-full disabled:bg-gray-900">
      <Send size={20} strokeWidth={1.75} absoluteStrokeWidth />
    </Button>
  ),
});

interface ActionBarProps {
  children?: React.ReactNode;
  onSubmit?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  submitText?: string;
  className?: string;
}

/**
 * ActionBar Component
 *
 * Bottom action bar with tools and submit button
 *
 * @improvements
 * 1. Extracted action bar layout
 * 2. Flexible children slot for tools
 * 3. Loading and disabled states
 * 4. Dynamic button import for code splitting
 * 5. Accessible with proper labels
 */
export function ActionBar({
  children,
  onSubmit,
  isLoading = false,
  isDisabled = false,
  submitText,
  className = '',
}: ActionBarProps) {
  return (
    <div
      className={`border-border flex items-center justify-between border-t pt-4 ${className}`}
    >
      {/* Left side - Tools */}
      <div className="flex items-center gap-2 md:gap-3">{children}</div>

      {/* Right side - Submit Button */}
      <ShinyButton
        disabled={isDisabled || isLoading}
        type="submit"
        className="rounded-full"
        id="submit-btn"
        onClick={onSubmit}
        aria-label={isLoading ? 'Submitting post' : 'Submit post'}
      >
        {isLoading ? (
          <span className="flex gap-2" aria-live="polite">
            <DefaultLoader size={20} />
            {submitText && <span className="sr-only">{submitText}</span>}
          </span>
        ) : (
          <>
            <Send size={20} strokeWidth={1.75} absoluteStrokeWidth />
            <span className="sr-only">Submit</span>
          </>
        )}
      </ShinyButton>
    </div>
  );
}
