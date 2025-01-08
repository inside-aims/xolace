import React from 'react';

import FilterPills from '@/components/hocs/exploreComponents/FilterPills';
import { generateMockPosts } from '@/constants/generateMockPosts';
import { shuffleArray } from '@/lib/utils';
import LocalSearch from '@/components/shared/search/LocalSearch';
import ExploreFeedList from '@/components/hocs/exploreComponents/ExploreFeedList';

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

const filterPosts = (filteredPosts: Post[], filter: string) => {
  switch (filter) {
    case 'popular':
      filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
      break;
    case 'controversial':
      filteredPosts.sort(
        (a, b) => b.upvotes + b.downvotes - (a.upvotes + a.downvotes),
      );
      break;
    case 'recent':
      filteredPosts.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      break;
    case 'trending':
      filteredPosts.sort((a, b) => {
        const scoreA = a.upvotes / Math.max(new Date(a.timestamp).getTime(), 1);
        const scoreB = b.upvotes / Math.max(new Date(b.timestamp).getTime(), 1);
        return scoreB - scoreA;
      });
      break;
    default:
      // If no filter is selected, randomize the posts
      filteredPosts = shuffleArray(filteredPosts);
  }

  return filteredPosts;
};

const ExplorePage = async ({ searchParams }: SearchParams) => {
  const posts = generateMockPosts(50);
  const { query = '', filter = '' } = await searchParams;

  let filteredPosts = posts.filter(post => {
    const matchQuery =
      query?.toLowerCase() === '' ||
      post.author_name.toLowerCase().includes(query?.toLowerCase()) ||
      post.content.toLowerCase().includes(query?.toLowerCase());

    const matchFilter = filter ? true : true;

    return matchQuery && matchFilter;
  });

  filteredPosts = filterPosts(filteredPosts, filter);

  return (
    <>
      <section className="w-full">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Explore the Shadows
        </h1>
      </section>

      <section className="mt-12">
        <LocalSearch
          placeholder="Search questions..."
          otherClasses="flex-1"
          route="/explore"
        />
      </section>

      <FilterPills />

      <ExploreFeedList filteredPosts={filteredPosts} />
    </>
  );
};

export default ExplorePage;
