// components/health-space/reflection/video-list.tsx
'use client';

import React from 'react';
import NothingInVoid from '@/components/shared/NotFound/NothingInVoid';
import VideoCard from "./video-card";
import { VideoCardProps } from ".";
import { VideoSkeleton } from './video-skeleton';

interface VideoListProps {
  videos: VideoCardProps[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  fetchNextPage: () => void;
  count: number;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  isLoading,
  isFetching,
  hasMore,
  fetchNextPage,
  count
}) => {
  if (isLoading) {
    return <VideoSkeleton/>;
  }

  if (count === 0 && !isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col justify-center items-center gap-5 py-10">
        <NothingInVoid />
        <p className="text-gray-400 text-sm">No videos match your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
        {videos.map((video) => (
          <VideoCard key={video.video_id} {...video} />
        ))}
      </section>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={fetchNextPage}
            disabled={isFetching}
            className="rounded-lg bg-lavender-500 px-6 py-2 font-semibold text-white hover:bg-lavender-600 disabled:opacity-50"
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
};

export default VideoList;