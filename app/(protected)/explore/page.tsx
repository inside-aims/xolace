import React from 'react';
import type { Metadata } from 'next';

import FilterPills from '@/components/hocs/exploreComponents/FilterPills';
import { seededShuffleArray } from '@/lib/utils';
import LocalSearch from '@/components/shared/search/LocalSearch';
import ExploreFeedList from '@/components/hocs/exploreComponents/ExploreFeedList';
import { createClient } from '@/utils/supabase/server';
import { ExploreHeader } from '@/components/hocs/exploreComponents/explore-header';

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

const filterPosts = (posts: Post[], filter: string) => {
  // Get today's date and use it as a seed
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // switch (filter) {
  //   case 'popular':
  //     posts.sort((a, b) => b.upvotes - a.upvotes);
  //     break;
  //   case 'controversial':
  //     posts.sort(
  //       (a, b) => b.upvotes + b.downvotes - (a.upvotes + a.downvotes),
  //     );
  //     break;
  //   case 'recent':
  //     posts.sort(
  //       (a, b) =>
  //         new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  //     );
  //     break;
  //   case 'trending':
  //     posts.sort((a, b) => {
  //       const scoreA = a.upvotes / Math.max(new Date(a.timestamp).getTime(), 1);
  //       const scoreB = b.upvotes / Math.max(new Date(b.timestamp).getTime(), 1);
  //       return scoreB - scoreA;
  //     });
  //     break;
  //   default:
  //     // If no filter is selected, use seeded shuffle for stable randomization
  //     return seededShuffleArray(posts, seed);
  // }

  switch (filter) {
    case 'popular':
      return [...posts].sort((a, b) => b.upvotes - a.upvotes);
    case 'controversial':
      return [...posts].sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
    case 'recent':
      return [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    case 'trending':
      return [...posts].sort((a, b) => (b.upvotes / Math.max(new Date(b.timestamp).getTime(), 1)) - (a.upvotes / Math.max(new Date(a.timestamp).getTime(), 1)));
    default:
      return seededShuffleArray(posts, seed);
  }
};

const ExplorePage = async ({ searchParams }: SearchParams) => {
  const supabase = await createClient();
  const postStatement = supabase
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
        ),
        post_slides(
      slide_index,
      content
    )
`,
  )
  .order('created_at', { ascending: false })
  .order('slide_index', {
    referencedTable: 'post_slides',
    ascending: true,
  });
const { data: postsData} = await postStatement;

if(!postsData) {
  return (
    <div className="text-center">
      <h2>No posts found.</h2>
    </div>
  );
}
// get searchParams
  const { query = '', filter = '' } = await searchParams;

  let filteredPosts = postsData.filter(post => {
    const matchQuery =
      query?.toLowerCase() === '' ||
      post.author_name.toLowerCase().includes(query?.toLowerCase()) ||
      post.content.toLowerCase().includes(query?.toLowerCase());

    const matchFilter = filter ? true : true;

    return matchQuery && matchFilter;
  });

  filteredPosts = filterPosts(filteredPosts, filter);

  return (
    <div className="container-spacing w-full">
      <ExploreHeader />

      <section className="mt-5 w-full">
        <LocalSearch
          placeholder="Search posts..."
          otherClasses="flex-1"
          route="/explore"
        />
      </section>

      <FilterPills />

      <ExploreFeedList filteredPosts={filteredPosts} />
    </div>
  );
};

export default ExplorePage;
