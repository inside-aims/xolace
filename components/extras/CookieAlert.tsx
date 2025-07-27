import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, X } from 'lucide-react';

interface CookieAlertProps {
  onDismiss: () => void;
  onSeeHow: () => void;
  onLearnWhy: () => void;
}

const CookieAlert = ({ onDismiss, onSeeHow, onLearnWhy }: CookieAlertProps) => {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 mb-5 py-0">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Having trouble signing in?
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">
                  We apologize for the inconvenience. Clearing your browser cookies might resolve this issue.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={onLearnWhy}
                    className="text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 underline underline-offset-2 hover:no-underline transition-colors"
                  >
                    Learn why
                  </button>
                  <button
                    onClick={onSeeHow}
                    className="text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 underline underline-offset-2 hover:no-underline transition-colors"
                  >
                    See how to clear cookies
                  </button>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="flex-shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CookieAlert;