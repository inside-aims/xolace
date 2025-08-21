"use client";

import React, { useState } from "react";
import { useInfiniteNotifications, type StatusFilter, type TimeFilter } from "@/hooks/notifications/useNotifications";
import ListHeader from "@/components/notifications/list-header";
import NotificationCard from "@/components/notifications/notification-card"; // The updated card
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUserState } from "@/lib/store/user";
import SearchLoader from "../shared/loaders/SearchLoader";

const filterOptions: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "important", label: "Important" },
  { key: "unread", label: "Unread" },
];

const timeOptions: { key: TimeFilter; label: string }[] = [
  { key: "all", label: "All Time" },
  { key: "today", label: "Today" },
  { key: "thisWeek", label: "This Week" },
  { key: "thisMonth", label: "This Month" },
];



const NotificationList = () => {
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeFilter>("all");
  const { user } = useUserState();

  // The component just calls the hook with the current filter states.
  const {
    data: notifications,
    fetchNextPage,
    hasMore,
    isLoading,
    isFetching,
  } = useInfiniteNotifications({
    userId: user?.id,
    statusFilter: selectedFilter,
    timeFilter: selectedTimeRange,
  });

  // Handle deleting all notifications
  const handleDeleteAllNotifications = () => {
    return ''
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      <section className="sticky top-0 z-20 bg-white dark:bg-[#121212]">
        <ListHeader
          onFilterChange={(filter) => setSelectedFilter(filter as StatusFilter)}
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onDeleteAll={handleDeleteAllNotifications}
        />
      </section>

      {/* Notification Section */}
      <section className="w-full mt-4 md:mt-8">
        {/* Time Range Selector */}
        <section className="w-full bg-white dark:bg-[#121212] flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm capitalize">
                {timeOptions.find((opt) => opt.key === selectedTimeRange)?.label}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex flex-col w-full">
              {timeOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => setSelectedTimeRange(opt.key)}
                  className={`w-full px-3 py-2 text-sm flex items-center justify-start capitalize ${selectedTimeRange === opt.key && ("bg-primary text-primary-foreground")}`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
        <div className="bg-bg dark:bg-bg-dark rounded-lg mt-2">
          {isLoading && <SearchLoader title="Loading Notifications..."/>}
          
          {!isLoading && notifications.length > 0 && (
            notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="text-center text-sm text-gray-500 p-4">No notifications match your filters.</div>
          )}

          {hasMore && (
            <div className="p-4 text-center">
              <Button onClick={() => fetchNextPage()} disabled={isFetching} className="bg-gradient-to-r from-lavender-400 to-lavender-500 hover:from-lavender-500 hover:to-lavender-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-lavender-500/25">
                {isFetching ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NotificationList;
