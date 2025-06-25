import type { Metadata } from 'next';
// import dynamic from 'next/dynamic'

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
// import { EnhancedAIChatInterface } from '@/components/chatbot-ai/enhanced-ai-chat-interface';

export const metadata: Metadata = {
  title: 'Feed',
  description: "Discover different stories , experiences from real and unique individuals as well as the community"
};

//const EnhancedAIChatInterface = dynamic(() => import('@/components/chatbot-ai/enhanced-ai-chat-interface'));

// Function to fetch posts with a Supabase client
// async function fetchPosts(supabase: any) {
//   const { data: postsData, error } = await supabase
//     .from('posts')
//     .select(
//       `
//        *,
//        posttags (
//           tags (
//             name
//           )
//         ),
//           votes(
//           user_id,
//           vote_type
//           ),
//           comments:comments(count),
//           views:views(count),
//         collections(
//           user_id
//         )
//     `,
//     )
//     .order('created_at', { ascending: false });

//   if (error) {
//     return [];
//   }

//   return postsData;
// }

// Cache the posts fetching function
// const getCachedPosts = unstable_cache(
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   async (supabase: any) => {
//     return fetchPosts(supabase);
//   },
//   ['posts-list'],
//   {
//     revalidate: 60, // Cache for 1 minute
//     tags: ['posts'],
//   },
// );

export default async function FeedPage() {
  const queryClient = new QueryClient();

  // Note we are now using fetchQuery()
 await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });

  // Create Supabase client with cookies outside the cached function
  // const supabase = await createClient();

  // Pass the Supabase client to the cached function
  //const initialPosts = await getCachedPosts(supabase);
  // const { data: postsData } = await supabase
  //   .from('posts')
  //   .select(
  //     `
  //      *,
  //      posttags (
  //         tags (
  //           name
  //         )
  //       ),
  //         votes(
  //         user_id,
  //         vote_type
  //         ),
  //         comments:comments(count),
  //         views:views(count),
  //       collections(
  //         user_id
  //       )
  //   `,
  //   )
  //   .order('created_at', { ascending: false });

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
