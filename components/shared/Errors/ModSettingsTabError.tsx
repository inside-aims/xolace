import { AlertCircle, Lock, RefreshCw, Settings, WifiOff } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ModSettingsTabError = ({error, slug, refetch}: {error: Error, slug: string, refetch?: () => void}) => {
    const router = useRouter();

    const isNetworkError = error?.message?.toLowerCase().includes('network') || 
                           error?.message?.toLowerCase().includes('fetch') ||
                           error?.message?.toLowerCase().includes('connection');
    const isPermissionError = error?.message?.toLowerCase().includes('permission') ||
                              error?.message?.toLowerCase().includes('unauthorized') ||
                              error?.message?.toLowerCase().includes('forbidden');
    


  return (
    <div className="flex flex-col items-start w-full justify-start gap-6 max-w-3xl animate-fade-in">
        {/* Header skeleton to maintain layout */}
        <div className="space-y-2">
          <h3 className="font-semibold text-2xl text-neutral-400 dark:text-neutral-600">
            General Settings
          </h3>
        </div>

        {/* Error display */}
        <div className="flex flex-col items-center justify-center w-full py-16 space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              {isNetworkError ? (
                <WifiOff className="h-12 w-12 text-red-500" />
              ) : isPermissionError ? (
                <Lock className="h-12 w-12 text-red-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-red-500" />
              )}
            </div>
          </div>

          <div className="text-center space-y-4 max-w-lg">
            <h3 className="font-semibold text-2xl text-neutral-900 dark:text-neutral-100">
              {isNetworkError 
                ? 'Connection Problem' 
                : isPermissionError 
                ? 'Access Denied' 
                : 'Settings Unavailable'
              }
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
              {isNetworkError 
                ? 'We\'re having trouble connecting to load your campfire settings. Please check your internet connection and try again.'
                : isPermissionError
                ? `You don't have permission to access the settings for campfire "${slug}". Only moderators and the campfire owner can modify settings.`
                : `We couldn't load the settings for campfire "${slug}". This might be due to a temporary issue or the campfire may not exist.`
              }
            </p>
            
            {error?.message && !isNetworkError && !isPermissionError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Error details:</strong> {error.message}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {!isPermissionError && (
              <Button 
                onClick={() => refetch?.()}
                className="flex items-center gap-2 bg-lavender-500 hover:bg-lavender-600 text-white rounded-lg px-8 py-2.5 font-medium transition-all duration-200 hover:scale-105"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => router.push(`/x/${slug}`)}
              className="rounded-lg px-8 py-2.5 border-neutral-300 dark:border-neutral-600 font-medium transition-all duration-200 hover:scale-105"
            >
              {isPermissionError ? 'Back to Campfire' : 'Go to Campfire'}
            </Button>
          </div>

          {/* Additional help */}
          <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 max-w-md">
            <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Need Help?
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {isPermissionError 
                ? 'If you believe you should have access to these settings, contact the campfire owner or an existing moderator.'
                : 'If this problem persists, try refreshing your browser or contact support for assistance.'
              }
            </p>
            <Link className="text-xs text-lavender-600 dark:text-lavender-400 leading-relaxed hover:underline" href="/channel">Visit Channel</Link>
          </div>
        </div>
      </div>
  )
}

export default ModSettingsTabError