'use client';

import React, { useEffect, useState } from 'react';
import {
  useInfiniteNotifications,
  type StatusFilter,
  type TimeFilter,
} from '@/hooks/notifications/useNotifications';
import { useRouter } from 'next/navigation';
import ListHeader from '@/components/notifications/list-header';
import NotificationCard from '@/components/notifications/notification-card'; // The updated card
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserState } from '@/lib/store/user';
import SearchLoader from '../shared/loaders/SearchLoader';
import { useDeleteAllNotifications } from '@/hooks/notifications/useNotifications';
import { Notification } from '@/types/global';

const filterOptions: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'important', label: 'Important' },
  { key: 'unread', label: 'Unread' },
];

const timeOptions: { key: TimeFilter; label: string }[] = [
  { key: 'all', label: 'All Time' },
  { key: 'today', label: 'Today' },
  { key: 'thisWeek', label: 'This Week' },
  { key: 'thisMonth', label: 'This Month' },
];

const NotificationList = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeFilter>('all');
  const user = useUserState(state => state.user);

  const deleteAllNotifications = useDeleteAllNotifications();

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

  // local notifications state
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (notifications) {
      setLocalNotifications(notifications);
    }
  }, [notifications]);

  // Handle deleting all notifications
  const handleDeleteAllNotifications = () => {
    deleteAllNotifications.mutate(undefined, {
      onSuccess: () => {
        setLocalNotifications([]);
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      <section className="sticky top-0 z-20 bg-white dark:bg-[#121212]">
        <ListHeader
          onFilterChange={filter => setSelectedFilter(filter as StatusFilter)}
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onDeleteAll={handleDeleteAllNotifications}
          isDeleteAllPending={deleteAllNotifications.isPending}
          notificationsCount={localNotifications.length}
        />
      </section>

      {/* Notification Section */}
      <section className="mt-4 w-full md:mt-8">
        {/* Time Range Selector */}
        <section className="flex w-full gap-2 bg-white dark:bg-[#121212]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 text-sm capitalize dark:border-gray-600">
                {timeOptions.find(opt => opt.key === selectedTimeRange)?.label}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex w-full flex-col">
              {timeOptions.map(opt => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => setSelectedTimeRange(opt.key)}
                  className={`flex w-full items-center justify-start px-3 py-2 text-sm capitalize ${selectedTimeRange === opt.key && 'bg-primary text-primary-foreground'}`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
        <div className="bg-bg dark:bg-bg-dark mt-2 rounded-lg">
          {isLoading && <SearchLoader title="Loading Notifications..." />}

          {!isLoading &&
            localNotifications.length > 0 &&
            localNotifications.map(n => (
              <NotificationCard key={n.id} notification={n} />
            ))}

          {!isLoading && localNotifications.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications match your filters.
            </div>
          )}

          {hasMore && (
            <div className="p-4 text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetching}
                className="from-lavender-400 to-lavender-500 hover:from-lavender-500 hover:to-lavender-600 shadow-lavender-500/25 rounded-full bg-gradient-to-r px-8 py-3 font-medium text-white shadow-lg transition-all duration-300"
              >
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
