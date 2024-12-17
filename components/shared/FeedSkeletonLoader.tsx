import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function FeedSkeletonCard() {
  return (
    <div className="w-full md:w-full mb-5 p-4 space-y-4 border border-gray-200 rounded-lg shadow-sm dark:border-gray-800">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <Skeleton className="h-4 w-[80px] ml-4" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
      </div>
      <div className="flex justify-between items-center">
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
    <div className="flex flex-col flex-1 gap-3 w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <FeedSkeletonCard key={index} />
      ))}
    </div>
  );
};

export default FeedSkeletonLoader;
