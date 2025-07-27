import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  InfoIcon, 
  CookieIcon, 
  RefreshCw, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const LearnWhyModal = ({ isOpen, onClose, onProceedToInstructions }: { isOpen: boolean; onClose: () => void; onProceedToInstructions: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            Why Clear Cookies?
          </DialogTitle>
          <DialogDescription>
            Understanding how cookies affect your sign-in experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* What are cookies */}
          {/* <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <CookieIcon className="h-4 w-4 text-amber-600" />
              What are cookies?
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Cookies are small data files that websites store in your browser to remember information about you, like login status, preferences, and session data.
            </p>
          </div> */}

          {/* Why issues occur */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Why do sign-in issues happen?
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                During our recent UX improvements, some authentication cookies became outdated or conflicted with the new system. This can cause:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Redirect loops (being sent back to sign-in page)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Session conflicts between old and new authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Temporary authentication failures</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How clearing helps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <RefreshCw className="h-4 w-4 text-green-600" />
              How does clearing cookies help?
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Clearing cookies removes the conflicting old data and allows our new authentication system to work properly with a fresh start. It's like giving your browser a clean slate.
            </p>
          </div>

          {/* Safety note */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Is it safe?
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Yes! Clearing cookies is completely safe and commonly recommended by tech support. You'll just need to sign back into other websites, but no personal data or passwords are lost.
                </p>
              </div>
            </div>
          </div>

          {/* Temporary issue note */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Good news:</strong> This is a temporary issue that affects some users during our transition. Once you clear cookies and sign in successfully, you shouldn't experience this problem again.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={onProceedToInstructions}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Show me how to clear cookies
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1"
            >
              Got it, thanks
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnWhyModal;