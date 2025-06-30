'use client';

import { Skeleton } from "@/components/ui/skeleton";


const VideoSkeleton = () => {
  return(
    <main className="flex flex-col items-center w-full px-4 -mt-5">
      <header className="w-full">
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
      </header>
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

export default VideoSkeleton;
