'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useInfiniteQuery,
  SupabaseTableData,
} from '@/hooks/use-infinite-query';
import VideoList from '@/components/health-space/reflection/video-list';

type VideoData = SupabaseTableData<'videos'>;

interface VideoListWrapperProps {
    searchQuery: string;
    filter: string;
  }
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

export default function VideoListWrapper({
    searchQuery,
    filter,
  }: VideoListWrapperProps) {


  const trailingQuery = React.useCallback(
    (qb: any) => {
      let q = qb;
      if (searchQuery) {
        q = q.ilike('title', `%${searchQuery}%`);
      }
      const { column, options } = getSortOptions(filter);
      return q.order(column, options);
    },
    [searchQuery, filter],
  );

  const {
    data: videos,
    isLoading,
    isFetching,
    hasMore,
    fetchNextPage,
    count
  } = useInfiniteQuery<VideoData>({
    tableName: 'videos',
    pageSize: 8,
    trailingQuery,
  });

  return (
    <VideoList
      videos={videos}
      isLoading={isLoading}
      isFetching={isFetching}
      hasMore={hasMore}
      fetchNextPage={fetchNextPage}
      count={count}
    />
  );
}
