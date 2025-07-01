'use client';

import React, { useMemo, useState } from 'react';
import NothingInVoid from '@/components/shared/NotFound/NothingInVoid';
import SharedHeader from "@/components/health-space/reflection/shared-header";
import VideoCard from "@/components/health-space/reflection/video-card";
import {VideoCardProps} from "@/components/health-space/reflection";

interface ReflectionsClientViewProps {
  videos: VideoCardProps[];
}

const ReflectionsClientView: React.FC<ReflectionsClientViewProps> = ({ videos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (searchTerm.trim() !== '') {
      result = result.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (currentFilter) {
      case 'mostRecent':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'mostViews':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'mostLikes':
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return result;
  }, [videos, searchTerm, currentFilter]);

  return (
    <main className="flex flex-col items-center w-full px-4 -mt-5">
      <SharedHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />

      {filteredVideos.length === 0 ? (
        <div className="flex w-full flex-1 flex-col justify-center items-center gap-5 py-10">
          <NothingInVoid />
          <p className="text-gray-400 text-sm">No video match your search or filters.</p>
        </div>
      ) : (
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video.videoId} {...video} />
          ))}
        </section>
      )}
    </main>
  );
};

export default ReflectionsClientView;
