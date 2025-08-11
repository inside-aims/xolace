'use client';

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CampfireCardSkeleton() {
  return (
    <Card className="w-full flex flex-col rounded-[20px]">
      <CardHeader className="flex items-start justify-between">
        <div className="w-full flex items-center justify-between gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default function CampfiresListSkeleton() {
  const skeletonCount = 6;

  return (
    <>
      <div className="w-full flex flex-col gap-4 px-4">
        {/* Heading Skeleton */}
        {/* <div className="text-center space-y-2">
          <Skeleton className="h-6 w-48 mx-auto"/>
          <Skeleton className="h-4 w-72 mx-auto"/>
        </div> */}

        {/* Search & Filter Skeleton */}
        {/* <div className="flex w-full items-center max-w-xl gap-4 justify-center">
          <Skeleton className="h-10 w-full sm:w-2/3 rounded-lg"/>
          <Skeleton className="h-10 w-40 rounded-lg"/>
        </div> */}

        {/* Card Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 pt-4">
          {Array.from({length: skeletonCount}).map((_, i) => (
            <CampfireCardSkeleton key={i}/>
          ))}
        </div>
      </div>
    </>
  );
}
