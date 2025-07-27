import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CookieIcon, 
} from 'lucide-react';
import Safari from './Safari';
import Chrome from './Chrome';

const CookieInstructionsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedBrowser, setSelectedBrowser] = useState('safari');

  const instructions = {
    safari: {
      title: 'Safari (iPhone/iPad)',
      icon: Safari,
      steps: [
        'Open the Settings app on your device',
        'Scroll down and tap "Safari"',
        'Scroll and tap "Clear History and Website Data"',
        'Confirm by tapping "Clear History and Data"',
        'Return to your browser and try signing in again'
      ]
    },
    chrome: {
      title: 'Chrome (Mobile)',
      icon: Chrome,
      steps: [
        'Open Chrome and tap the three dots menu (⋮) in the top right',
        'Tap "Settings"',
        'Tap "Privacy and security"',
        'Tap "Clear browsing data"',
        'Select "Cookies and site data" (you can uncheck other options)',
        'Choose "All time" as the time range',
        'Tap "Clear data" and confirm',
        'Return to the sign-in page and try again'
      ]
    }
  };

  const currentInstructions = instructions[selectedBrowser as keyof typeof instructions];
  const IconComponent = currentInstructions.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CookieIcon className="h-5 w-5" />
            Clear Browser Cookies
          </DialogTitle>
          <DialogDescription>
            Follow these steps to clear cookies and resolve sign-in issues
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Browser Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedBrowser('safari')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedBrowser === 'safari'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Safari className="h-4 w-4" />
              Safari
            </button>
            <button
              onClick={() => setSelectedBrowser('chrome')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedBrowser === 'chrome'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Chrome className="h-4 w-4" />
              Chrome
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <IconComponent className="h-4 w-4" />
              {currentInstructions.title}
            </div>
            <ol className="space-y-2">
              {currentInstructions.steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Help Note */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Clearing cookies will sign you out of other websites, but it should resolve the sign-in redirect issue you're experiencing.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieInstructionsModal;