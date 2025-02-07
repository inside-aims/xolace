import { createClient } from '@/utils/supabase/server';
import FeedList from '@/components/shared/FeedList';
import { unstable_cache } from 'next/cache';
import TourWrapper from '@/components/shared/Tour/TourWrapper';
import { FeedSteps } from '@/constants/tourSteps';

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
    console.error('Error fetching posts:', error.message);
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
    tags: ['posts']
  }
);

export default async function FeedPage() {
  // Create Supabase client with cookies outside the cached function
  const supabase = await createClient();
  
  // Pass the Supabase client to the cached function
  const initialPosts = await getCachedPosts(supabase);
  
  return (
    <TourWrapper steps={FeedSteps}>
    <div className="sm:container">
      <FeedList initialPosts={initialPosts} />
    </div>
    </TourWrapper>
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
