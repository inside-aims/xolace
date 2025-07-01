// app/reflections/page.tsx or wherever your route is
import React from 'react';
import type { Metadata } from 'next';
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import {fetchBunnyVideos} from "@/utils/bunny/bunny";
import ReflectionsClientView from "@/app/(protected)/reflections/ReflectionClientView";
import {VideoCardProps} from "@/components/health-space/reflection";

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

  return (
    <HealthTipsWrapper>
      <ReflectionsClientView videos={videos} />
    </HealthTipsWrapper>
  );
};

export default ReflectionsPage;
