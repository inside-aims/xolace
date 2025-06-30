import React from 'react';
import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
import VideoSkeleton from "@/components/health-space/reflection/video-skeleton";
// HealthTipsSkeleton is now used internally by HealthTipsWrapper when isLoading is true

const Loading = () => {
  return (
    <HealthTipsWrapper isLoading={true}>
      <VideoSkeleton/>
    </HealthTipsWrapper>
  );
};

export default Loading;
