import React from 'react'
import type { Metadata } from 'next'
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import SharedHeader from "@/components/health-space/reflection/shared-header";
import VideoCard from "@/components/health-space/reflection/video-card";



export const metadata: Metadata = {
  title: 'Reflections',
  description: "Mentor-led video reflections offering perspective, support, and guidance."
}

const ReflectionsPage = () => {
  const videos: VideoCardProps[] = [
    { videoId: 'reflections', thumbnail: '/assets/images/auth/sign-in.png',title: 'Reflections', duration: 23, userImg: "/assets/images/auth/sign-in.png", views: 23, username: 'FedeJnr', visibility: "public", createdAt: new Date },
    { videoId: '2', thumbnail: '/assets/images/auth/sign-up.png',title: 'Reflections', duration: 9101, userImg: "/assets/images/auth/sign-up.png", views: 23, username: 'FedeJnr', visibility: "public", createdAt: new Date },
  ]
  return (
    <HealthTipsWrapper>
      <main className="flex flex-col items-center w-full px-4 -mt-5">
        <SharedHeader/>
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          {videos.map((video) => (
            <VideoCard key={video.videoId} {...video} />
          ))}
        </section>

      </main>

    </HealthTipsWrapper>
  )
}

export default ReflectionsPage;