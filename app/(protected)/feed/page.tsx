import type { Metadata } from 'next';

import EnhancedFeedList from '@/components/shared/EnhancedFeedList';
import TourProvider from '@/components/shared/Tour/TourProvider';
import { FeedSteps } from '@/constants/tourSteps';
import TourButton from '@/components/shared/Tour/TourButton';
import WelcomeModalCard from '@/components/cards/WecomeModalCard';
import DailyPrompt from '@/components/shared/DailyPrompt';
import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getEnhancedFeedForCurrentUser } from '@/queries/posts/getEnhancedFeedForCurrentUser.action';

export const metadata: Metadata = {
  title: 'Feed',
  description: "Discover different stories, experiences from real and unique individuals as well as the community"
};

export default async function EnhancedFeedPage() {
  const queryClient = new QueryClient();

  // Prefetch the first page of enhanced feed
  try {
    const initialFeedData = await getEnhancedFeedForCurrentUser(50, 0);
    
    // Set the initial data for the infinite query
    queryClient.setQueryData(['enhanced-feed'], {
      pages: [
        {
          posts: initialFeedData,
          nextOffset: initialFeedData.length === 50 ? 50 : null,
          hasMore: initialFeedData.length === 50
        }
      ],
      pageParams: [0]
    });
  } catch (_) {
    // Continue without prefetched data - the client will handle loading
  }

  return (
    <TourProvider steps={FeedSteps}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HealthTipsWrapper>
          <DailyPrompt />
          <EnhancedFeedList />
        </HealthTipsWrapper>
      </HydrationBoundary>
      <div className="fixed right-6 bottom-10 z-50 block rounded-full md:right-20 md:bottom-10 bg-green-500">
        <TourButton />
      </div>
      <WelcomeModalCard />
    </TourProvider>
  );
}