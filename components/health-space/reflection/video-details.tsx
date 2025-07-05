'use client';

import { useState } from 'react';
import VideoPlayer from './video-player';
import VideoMetadata from './video-metadata';
import { VideoTabs } from './video-tabs';
import { getVideoData } from '@/queries/videos/getVideoData';
import { VideoDetailsSkeleton } from './video-skeleton';

interface VideoDetailsProps {
  videoId: string;
}

export function VideoDetails({ videoId }: VideoDetailsProps) {
  const [activeTab, setActiveTab] = useState<'transcript' | 'metadata'>(
    'transcript',
  );

  const { data: video, isLoading, isError, error } = getVideoData(videoId);

  // Handle loading state
  if (isLoading) {
    return (
      <VideoDetailsSkeleton/>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="w-full flex min-h-screen items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  // Handle case where video is not found
  if (!video) {
    return (
      <div className="w-full flex min-h-screen items-center justify-center text-white">
        Video not found.
      </div>
    );
}

    return (
      <div className=" text-white w-full px-2">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="sticky top-3 z-10">
            <VideoPlayer videoId={videoId} />
          </div>
          <div className="h-[calc(100vh-90.25vw)] overflow-y-auto mt-5  pb-6">
            <VideoMetadata video={video} />
            <VideoTabs
              video={video}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="container mx-auto max-w-7xl px-4 py-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <VideoPlayer videoId={videoId} />
                <VideoMetadata video={video} />
              </div>
              <div className="lg:col-span-1">
                <VideoTabs
                  video={video}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

