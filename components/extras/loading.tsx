import React from 'react';
import FeedSkeletonLoader from '@/components/shared/loaders/FeedSkeletonLoader';
import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
// HealthTipsSkeleton is now used internally by HealthTipsWrapper when isLoading is true

const Loading = () => {
  return (
    <HealthTipsWrapper isLoading={true}>
      <FeedSkeletonLoader />
    </HealthTipsWrapper>
  );
};

export default Loading;
