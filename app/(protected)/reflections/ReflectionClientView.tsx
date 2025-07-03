// app/(protected)/reflections/ReflectionsView.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { useInfiniteQuery, SupabaseTableData } from '@/hooks/use-infinite-query';
import SharedHeader from "@/components/health-space/reflection/shared-header";
import VideoList from '@/components/health-space/reflection/video-list';


// Define a type for your video data
type VideoData = SupabaseTableData<'videos'>;

// Helper to translate filter keys to Supabase query options
const getSortOptions = (filter: string) => {
  switch (filter) {
    case 'mostViewed':
      return { column: 'views', options: { ascending: false } };
    case 'leastViewed':
      return { column: 'views', options: { ascending: true } };
    case 'oldestFirst':
      return { column: 'created_at', options: { ascending: true } };
    case 'mostRecent':
    default:
      return { column: 'created_at', options: { ascending: false } };
  }
};

const ReflectionsClientView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL search parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'mostRecent');

  // Memoize the query-building function to prevent unnecessary refetches
  const trailingQuery = useCallback(
    (queryBuilder: any) => {
      let modifiedQuery = queryBuilder;

      // Add search logic
      if (searchQuery.trim()) {
        modifiedQuery = modifiedQuery.ilike('title', `%${searchQuery.trim()}%`);
      }

      // Add sorting logic
      const { column, options } = getSortOptions(filter);
      modifiedQuery = modifiedQuery.order(column, options);

      return modifiedQuery;
    },
    [searchQuery, filter]
  );

  const {
    data: videos,
    isLoading,
    isFetching,
    hasMore,
    fetchNextPage,
  } = useInfiniteQuery<VideoData>({
    tableName: 'videos', // Assuming your table is named 'videos'
    pageSize: 8,
    trailingQuery,
  });

  const updateURL = (newValues: { query?: string; filter?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValues.query !== undefined) {
      if (newValues.query) params.set('query', newValues.query);
      else params.delete('query');
    }
    if (newValues.filter) {
      params.set('filter', newValues.filter);
    }
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateURL({ query });
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    updateURL({ filter: newFilter });
  };

  return (
    <main className="flex w-full flex-col items-center px-4 -mt-5">
      <SharedHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedFilter={filter}
        onFilterChange={handleFilterChange}
      />
      <VideoList
        videos={videos}
        isLoading={isLoading}
        isFetching={isFetching}
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
      />
    </main>
  );
};

export default ReflectionsClientView;