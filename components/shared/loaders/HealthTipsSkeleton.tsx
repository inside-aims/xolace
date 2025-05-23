import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// const HealthTipsSkeletonCard = () => {
//   return (
//     <div className="flex flex-col gap-4 p-4 border rounded-xl shadow-lg">
//       <div className="flex items-center justify-between">
//         <Skeleton className="h-5 w-3/5" />
//         <Skeleton className="h-5 w-5 rounded-full" />
//       </div>
//       <div className="space-y-2">
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-4 w-5/6" />
//       </div>
//       <Skeleton className="h-8 w-1/3 rounded-full" />
//     </div>
//   );
// };

const HealthTipsSkeleton = () => {
  return (
    <div className="hidden w-full flex-col gap-6 p-4 md:flex">
      {/* Skeleton for the Xolace Wellness Insights card */}
      <div className="flex flex-col gap-2 rounded-xl border p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Skeleton for the list of health tips */}
      <div className="flex flex-col gap-6 rounded-xl border p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex flex-row items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-1 h-8 w-1/4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center border-t pt-4">
          <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default HealthTipsSkeleton;
