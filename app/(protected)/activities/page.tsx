'use client';

import { useState, useEffect, useRef } from 'react';
import { ActivityFeed } from '@/components/activity/activity-feed';
import { ActivityFilters } from '@/components/activity/activity-filters';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, UserCircle } from 'lucide-react';

export default function ActivitiesPage() {
  const [filter, setFilter] = useState<string>('all');
  const [activityView, setActivityView] = useState<
    'my-activities' | 'related-to-me'
  >('my-activities');
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { isMobile, state } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        // Get the header's position relative to the viewport
        const headerRect = headerRef.current.getBoundingClientRect();
        // Get the height of the site header (using the CSS variable)
        const siteHeaderHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--header-height',
          ) || '90px',
        );

        // Check if the header should be sticky (when it reaches the site header)
        setIsSticky(headerRect.top <= siteHeaderHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container space-y-6 px-1 py-6 lg:px-10">
      <div
        ref={headerRef}
        className={`${
          isSticky
            ? 'dark:bg-bg-dark bg-bg /95 fixed top-(--header-height) z-40 px-4 py-4 backdrop-blur-sm transition-all duration-200'
            : ''
        } ${
          // Adjust width based on sidebar state and device size
          isSticky && !isMobile
            ? state === 'expanded'
              ? 'md:right-0 md:left-(--sidebar-width) md:w-[calc(100%-var(--sidebar-width))]'
              : 'md:right-0 md:left-(--sidebar-width-icon) md:w-[calc(100%-var(--sidebar-width-icon))]'
            : isSticky
              ? 'right-0 left-0 w-full'
              : ''
        }`}
      >
        <div className={`md:container md:max-w-4xl`}>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 md:gap-0">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Activity Feed
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Track your interactions and activities on Xolace
              </p>
            </div>

            <Separator className="hidden md:block" />

            <Tabs
              value={activityView}
              onValueChange={value =>
                setActivityView(value as 'my-activities' | 'related-to-me')
              }
              className="w-full"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
                <TabsList className="grid w-full grid-cols-2 md:w-[260px]">
                  <TabsTrigger
                    value="my-activities"
                    className="flex items-center gap-2"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span className="text-sm">My Activities</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="related-to-me"
                    className="flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Related to Me</span>
                  </TabsTrigger>
                </TabsList>

                <ActivityFilters
                  currentFilter={filter}
                  onFilterChange={setFilter}
                />
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add a spacer div when header becomes sticky to prevent content jump */}
      {isSticky && <div className="h-[180px] md:h-[150px]"></div>}

      <Tabs value={activityView} className="mt-0">
        <TabsContent value="my-activities" className="mt-0 w-full pt-0">
          <ActivityFeed filter={filter} viewType="my-activities" />
        </TabsContent>
        <TabsContent value="related-to-me" className="mt-0 pt-0">
          <ActivityFeed filter={filter} viewType="related-to-me" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
