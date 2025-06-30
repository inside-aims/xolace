'use client';

import { Skeleton } from "@/components/ui/skeleton";

const VideoDetailsSkeleton = () => {
  return (
    <section className="grid grid-cols-12 gap-8 items-start h-full md:h-[calc(100vh-var(--header-height))]">
      {/* Left - Video and Info */}
      <div className="col-span-12 md:col-span-8 space-y-4">
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right - Tabs & Content */}
      <div className="col-span-12 md:col-span-4 space-y-4">
        <div className="flex gap-4 border-b border-neutral-200 pb-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="space-y-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoDetailsSkeleton;
