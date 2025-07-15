'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const NotificationSkeleton = () => {
  return(
    <div className="skeleton flex fle-col">
      <section>
        <ListHeaderSkeleton/>
      </section>
      <div className="flex fle-col mt-8">
        <section className="flex fle-col">
          { Array.from({length: 3}).map((_, index) => (
            <NotificationCardSkeleton key={index} />
          ))}
        </section>
        <section className="flex fle-col">
          { Array.from({length: 4}).map((_, index) => (
            <NotificationCardSkeleton key={index}/>
          ))}
        </section>
      </div>
    </div>
  )
}


export const NotificationCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col border shadow-lg bg-neutral-100 dark:bg-dark-2">
      <div className="w-full p-4 flex items-start justify-between cursor-pointer">
        <div className="w-full flex flex-row gap-4 items-center justify-between">
          <div className="w-full flex flex-row gap-4 items-start">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
};


export const ListHeaderSkeleton = () => {
  return (
    <header className="w-full rounded-lg flex flex-col gap-2 md:gap-4 shadow-lg p-4 border">
      <section>
        <Skeleton className="h-6 w-48" />
      </section>

      <section className="hidden md:flex flex-row gap-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-7 w-20 rounded-md" />
        ))}
      </section>

      <section className="w-full flex md:hidden items-center justify-between">
        <div />
        <Skeleton className="h-9 w-32 rounded-full" />
      </section>
    </header>
  );
};

export const NotificationDetailsSkeleton = () => {
  return (
    <main
      id="notification-details-skeleton"
      className="flex w-full min-h-screen flex-col px-4 items-start gap-8"
    >
      {/* Back Button */}
      <header className="w-full">
        <Link href={"/notifications"}>
          <Button variant="outline" size="sm" className="rounded-full">
            <MoveLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Button>
        </Link>
      </header>

      <section className="relative w-full max-w-2xl bg-card border rounded-2xl p-4 shadow-lg overflow-hidden">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-muted animate-pulse rounded-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
        <Skeleton className="h-6 w-2/3 rounded-md mb-2" />

        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <Skeleton className="h-4 w-40 mt-4 rounded-md" />
      </section>
    </main>
  );
};
