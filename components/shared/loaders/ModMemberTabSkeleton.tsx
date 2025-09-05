import { Loader2 } from 'lucide-react'
import React from 'react'

const ModMemberTabSkeleton = () => {
  return (
    <div className="flex flex-col items-start w-full justify-start gap-6 animate-fade-in">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg animate-pulse" />
        </div>

        {/* Tab skeleton */}
        <div className="flex gap-4 w-full">
          {Array(4).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="h-10 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg animate-pulse"
              style={{ width: `${80 + i * 20}px` }}
            />
          ))}
        </div>

        {/* Loading display */}
        <div className="flex flex-col items-center justify-center w-full py-20 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-ocean-200 dark:border-ocean-800 rounded-full animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-ocean-500" />
          </div>
          
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-xl text-neutral-900 dark:text-neutral-100">
              Loading Campfire
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
              Getting everything ready for managing your community...
            </p>
          </div>

          {/* Content skeleton */}
          <div className="w-full max-w-4xl mt-8 space-y-4">
            {/* Search bar skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-10 w-80 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
              <div className="flex gap-2">
                <div className="h-9 w-32 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                <div className="h-9 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Table skeleton */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4">
                <div className="grid grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {Array(3).fill(0).map((_, rowIndex) => (
                  <div key={rowIndex} className="p-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-neutral-300 dark:bg-neutral-600 rounded-full animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                          <div className="h-3 w-16 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-12 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-16 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                        <div className="h-3 w-12 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ModMemberTabSkeleton