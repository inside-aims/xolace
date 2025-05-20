import type { Metadata } from 'next';

import { createClient } from '@/utils/supabase/server';
import FeedList from '@/components/shared/FeedList';
import { unstable_cache } from 'next/cache';
import TourProvider from '@/components/shared/Tour/TourProvider';
import { FeedSteps } from '@/constants/tourSteps';
import TourButton from '@/components/shared/Tour/TourButton';
import WelcomeModalCard from '@/components/cards/WecomeModalCard';
import DailyPrompt from '@/components/shared/DailyPrompt';
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";

export const metadata: Metadata = {
  title: 'Feed',
};

// Function to fetch posts with a Supabase client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchPosts(supabase: any) {
  const { data: postsData, error } = await supabase
    .from('posts')
    .select(
      `
       *,
       posttags (
          tags (
            name
          )
        ),
          votes(
          user_id,
          vote_type
          ),
          comments:comments(count),
          views:views(count),
        collections(
          user_id
        )  
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return postsData;
}

// Cache the posts fetching function
const getCachedPosts = unstable_cache(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (supabase: any) => {
    return fetchPosts(supabase);
  },
  ['posts-list'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['posts'],
  },
);

export default async function FeedPage() {
  // Create Supabase client with cookies outside the cached function
  const supabase = await createClient();

  // Pass the Supabase client to the cached function
  const initialPosts = await getCachedPosts(supabase);

  return (
    <TourProvider steps={FeedSteps}>
      <HealthTipsWrapper>
        <DailyPrompt/>
        <FeedList initialPosts={initialPosts}/>
      </HealthTipsWrapper>
      <div className="fixed right-6 bottom-10 z-50 block rounded-full md:right-20 md:bottom-10">
        <TourButton/>
      </div>
      <WelcomeModalCard/>
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
