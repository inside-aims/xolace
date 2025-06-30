// app/reflections/page.tsx or wherever your route is
import React from 'react';
import type { Metadata } from 'next';
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import SharedHeader from "@/components/health-space/reflection/shared-header";
import VideoCard from "@/components/health-space/reflection/video-card";
import {fetchBunnyVideos} from "@/utils/bunny/bunny";

export const metadata: Metadata = {
  title: 'Reflections',
  description: "Mentor-led video reflections offering perspective, support, and guidance.",
};

const ReflectionsPage = async () => {
  const rawVideos = await fetchBunnyVideos();

  const videos: VideoCardProps[] = rawVideos.items.map((video: any) => ({
    videoId: video.guid,
    thumbnail: video.thumbnailFileName,
    title: video.title || 'Untitled',
    duration: Math.floor(video.length),
    userImg: "/assets/images/auth/sign-in.png",
    views: video.views || 0,
    username: 'FedeJnr',
    visibility: video.isPublic ? 'public' : 'private',
    createdAt: new Date(video.dateUploaded),
  }));

  console.log("videos", videos);

  return (
    <HealthTipsWrapper>
      <main className="flex flex-col items-center w-full px-4 -mt-5">
        <SharedHeader />
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          {videos.map((video) => (
            <VideoCard key={video.videoId} {...video} />
          ))}
        </section>
      </main>
    </HealthTipsWrapper>
  );
};

export default ReflectionsPage;
