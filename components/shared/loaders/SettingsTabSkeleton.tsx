import { Loader2 } from 'lucide-react'
import React from 'react'

const SettingsTabSkeleton = () => {
  return (
    <div className="flex flex-col items-start w-full justify-start gap-6 max-w-3xl animate-fade-in">
    {/* Header skeleton */}
    <div className="space-y-2">
      <div className="h-8 w-56 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg animate-pulse" />
    </div>

    {/* Tab skeleton */}
    <div className="flex gap-4 w-full">
      <div className="h-10 w-20 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg animate-pulse" />
      <div className="h-10 w-32 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg animate-pulse" />
    </div>

    {/* Loading display */}
    <div className="flex flex-col items-center justify-center w-full py-16 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-lavender-200 dark:border-lavender-800 rounded-full animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-lavender-500" />
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="font-semibold text-xl text-neutral-900 dark:text-neutral-100">
          Loading Settings
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Preparing your campfire configuration options...
        </p>
      </div>

      {/* Settings skeleton */}
      <div className="w-full max-w-2xl mt-8 space-y-6">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="space-y-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                <div className="h-8 w-8 bg-neutral-300 dark:bg-neutral-600 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default SettingsTabSkeleton