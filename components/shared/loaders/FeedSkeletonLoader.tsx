import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function FeedSkeletonCard() {
  return (
    <div className="mb-5 w-full space-y-4 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800 md:w-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <Skeleton className="ml-4 h-4 w-[80px]" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  );
}

const FeedSkeletonLoader = () => {
  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <FeedSkeletonCard key={index} />
      ))}
    </div>
  );
};

export default FeedSkeletonLoader;
