"use client";

import { useEffect, useRef, useCallback } from "react";
import { useActivityStore } from "@/lib/store/activity-store";
import { ActivityItem } from "@/components/activity/activity-item";
import { ActivitySkeleton } from "@/components/activity/activity-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ActivityFeedProps {
  filter: string;
  viewType: "my-activities" | "related-to-me";
}

export function ActivityFeed({ filter, viewType }: ActivityFeedProps) {
  const { logs, isLoading, hasMore, error, fetchLogs, resetLogs } = useActivityStore();
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Reset and fetch logs when filter or viewType changes
  useEffect(() => {
    resetLogs();
    fetchLogs(filter, viewType);
  }, [filter, viewType, resetLogs, fetchLogs]);
  
  const lastLogElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchLogs(filter, viewType);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchLogs, filter, viewType]);
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (logs.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">
          {viewType === "my-activities" 
            ? "No activities yet" 
            : "No related activities yet"}
        </h3>
        <p className="text-muted-foreground mt-1">
          {viewType === "my-activities"
            ? "Your activity feed will show up here once you start interacting on Xolace."
            : "Activities related to you will show up here when others interact with your content."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {logs.map((log, index) => {
        if (logs.length === index + 1) {
          return <div ref={lastLogElementRef} key={log.id}><ActivityItem log={log} viewType={viewType} /></div>;
        } else {
          return <ActivityItem key={log.id} log={log} viewType={viewType} />;
        }
      })}
      
      {isLoading && (
        <div className="space-y-4">
          <ActivitySkeleton />
          <ActivitySkeleton />
          <ActivitySkeleton />
        </div>
      )}
    </div>
  );
}