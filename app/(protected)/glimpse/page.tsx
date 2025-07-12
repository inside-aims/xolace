// app/reflections/page.tsx or wherever your route is
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
import ReflectionsClientView from '@/app/(protected)/glimpse/ReflectionClientView';
import SharedHeaderWrapper from '@/components/health-space/reflection/SharedHeaderWrapper';
import VideoListWrapper from '@/components/health-space/reflection/VideoListWrapper';
import { VideoSkeleton } from '@/components/health-space/reflection/video-skeleton';

export const metadata: Metadata = {
  title: 'Reflections',
  description:
    'Mentor-led video reflections offering perspective, support, and guidance.',
};

const ReflectionsPage = async () => {
  return (
    <HealthTipsWrapper>
      <ReflectionsClientView />
    </HealthTipsWrapper>
  );
};

export default ReflectionsPage;
