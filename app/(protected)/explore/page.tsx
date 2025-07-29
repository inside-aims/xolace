import React from 'react';
import type { Metadata } from 'next';

import FilterPills from '@/components/hocs/exploreComponents/FilterPills';
import { seededShuffleArray } from '@/lib/utils';
import LocalSearch from '@/components/shared/search/LocalSearch';
import ExploreFeedList from '@/components/hocs/exploreComponents/ExploreFeedList';
import { createClient } from '@/utils/supabase/server';
import { ExploreHeader } from '@/components/hocs/exploreComponents/explore-header';
import ExploreContent from '@/components/hocs/exploreComponents/explore-content';

export const metadata: Metadata = {
  title: 'Explore',
  description: "Browse authentic stories and experiences shared by real individuals within our vibrant mental health and self-growth community."
}

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

interface Mood {
  emoji: string;
  style: string;
  name: string;
}

interface Post {
  id: string;
  author_name: string;
  author_avatar_url: string;
  content: string;
  timestamp: string;
  mood: Mood;
  expires_in_24hr: boolean;
  upvotes: number;
  downvotes: number;
  comments: number;
}

const ExplorePage = async ({ searchParams }: SearchParams) => {
//   const supabase = await createClient();
//   const postStatement = supabase
//   .from('posts')
//   .select(
//     `
// *,
// posttags (
//   tags (
//     name
//   )
// ),
//   votes(
//   user_id,
//   vote_type
//   ),
//   comments:comments(count),
//   views:views(count),
//   collections(
//           user_id
//         ),
//         post_slides(
//       slide_index,
//       content
//     )
// `,
//   )
//   .order('created_at', { ascending: false })
//   .order('slide_index', {
//     referencedTable: 'post_slides',
//     ascending: true,
//   });
// const { data: postsData} = await postStatement;

// if(!postsData) {
//   return (
//     <div className="text-center">
//       <h2>No posts found.</h2>
//     </div>
//   );
// }
// get searchParams
  const { query = '', filter = '' } = await searchParams;

  

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        <ExploreHeader />
        <ExploreContent query={query} filter={filter} />
      </div>
    </div>
  );
};

export default ExplorePage;
