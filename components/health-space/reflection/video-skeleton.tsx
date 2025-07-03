'use client';

import { Skeleton } from "@/components/ui/skeleton";


export const VideoSkeleton = () => {
  return(
    <main className="flex flex-col items-center w-full px-4 mt-4">
      {/* <header className="w-full">
        <section className="w-full mb-2">
          <Skeleton className="h-4 w-24 mb-2"/>
          <Skeleton className="h-6 w-40"/>
        </section>

        <section className="w-full flex items-center justify-between gap-4 mt-4">
          <div className="relative w-full md:w-[50%]">
            <Skeleton className="h-10 w-full rounded-full"/>
          </div>

          <Skeleton className="h-10 w-[140px] rounded-full"/>
        </section>
      </header> */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
        {Array.from({length: 4}).map((_, i) => <ReflectionFallback key={i}/>)}
      </section>
    </main>
  )
}

export const ReflectionFallback = () => {
  return (
    <div className="w-full flex flex-col shadow-lg rounded-xl border overflow-hidden">
      <Skeleton className="w-full h-[250px] rounded-t-xl"/>

      <div className="flex flex-col gap-4 p-4">
        {/* User Section */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-9 w-9 rounded-full"/>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24"/>
            <Skeleton className="h-3 w-16"/>
          </div>
        </div>

        {/* Title and Date */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/2" />

        {/* Buttons */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};


export const VideoDetailsSkeleton = () => {
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
