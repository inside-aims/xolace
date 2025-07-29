import type { Metadata } from 'next';

import FeedList from '@/components/shared/FeedList';
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
import { getAllPosts } from '@/queries/posts/getAllPosts.action';

export const metadata: Metadata = {
  title: 'Feed',
  description: "Discover different stories , experiences from real and unique individuals as well as the community"
};

export default async function FeedPage() {
  const queryClient = new QueryClient();

  // Note we are now using fetchQuery()
 await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });

  return (
    <TourProvider steps={FeedSteps}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HealthTipsWrapper>
          <DailyPrompt />

          <FeedList />
        </HealthTipsWrapper>
      </HydrationBoundary>
      <div className="fixed right-6 bottom-10 z-50 block rounded-full md:right-20 md:bottom-10 bg-green-500">
        <TourButton />
      </div>

      {/* Enhanced Chat Interface */}
      {/* <EnhancedAIChatInterface /> */}
      <WelcomeModalCard />
    </TourProvider>
  );
}

{
  /* <RadioGroup defaultValue="comfortable" className=' flex' >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" className=' w-20 h-20 bg-white'  >
          <RocketIcon className="mr-2 h-10 w-10 text-red-400" />
        </RadioGroupItem>
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup> */
}
