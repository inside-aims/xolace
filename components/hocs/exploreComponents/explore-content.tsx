'use client'

import React, { useMemo } from 'react';

import FilterPills from '@/components/hocs/exploreComponents/FilterPills';
import { seededShuffleArray } from '@/lib/utils';
import LocalSearch from '@/components/shared/search/LocalSearch';
import ExploreFeedList from '@/components/hocs/exploreComponents/ExploreFeedList';
import { createClient } from '@/utils/supabase/server';
import { ExploreHeader } from '@/components/hocs/exploreComponents/explore-header';
import { Post } from '@/types/global';
import { usePosts } from '@/hooks/posts/usePostsData';
import FeedSkeletonLoader from '@/components/shared/loaders/FeedSkeletonLoader';


interface ExploreContentProps {
  query: string;
  filter: string;
}

interface Mood {
  emoji: string;
  style: string;
  name: string;
}

// interface Post {
//   id: string;
//   author_name: string;
//   author_avatar_url: string;
//   content: string;
//   timestamp: string;
//   mood: Mood;
//   expires_in_24hr: boolean;
//   upvotes: number;
//   downvotes: number;
//   comments: number;
// }

const filterPosts = (posts: Post[], filter: string) => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  
    switch (filter) {
      case "popular":
        return [...posts].sort((a, b) => b.upvotes - a.upvotes)
      case "spicy":
        return [...posts].sort((a, b) => b.upvotes + b.downvotes - (a.upvotes + a.downvotes))
      case "fresh":
        return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case "trending":
        return [...posts].sort((a, b) => {
          const scoreA = a.upvotes / Math.max(Date.now() - new Date(a.created_at).getTime(), 1)
          const scoreB = b.upvotes / Math.max(Date.now() - new Date(b.created_at).getTime(), 1)
          return scoreB - scoreA
        })
      default:
        return seededShuffleArray(posts, seed)
    }
  }

const ExploreContent = ({query, filter}: ExploreContentProps) => {
 const { data: queryPosts, isPending, isError, error } = usePosts();


//   let filteredPosts = queryPosts.filter(post => {
//     const matchQuery =
//       query?.toLowerCase() === '' ||
//       post.author_name.toLowerCase().includes(query?.toLowerCase()) ||
//       post.content.toLowerCase().includes(query?.toLowerCase());

//     const matchFilter = filter ? true : true;

//     return matchQuery && matchFilter;
//   });

  const filteredPosts = useMemo(() => {
    if (!queryPosts) return;
    const filtered = queryPosts.filter((post) => {
      const matchQuery =
        query.toLowerCase() === "" ||
        post.author_name.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())

      return matchQuery
    })

    return filterPosts(filtered, filter)
  }, [queryPosts, query, filter])

  return (
    <div className="space-y-6 sm:space-y-8 w-full">

      <LocalSearch
        placeholder="Search posts..."
        otherClasses="flex-1"
        route="/explore"
      />

      <FilterPills />
{
    isPending && <FeedSkeletonLoader />
}

{
    isError && <div>{error.message}</div>
}
{
    !isPending && !isError && !filteredPosts && <div>No posts found.</div>
}
     {filteredPosts && <ExploreFeedList filteredPosts={filteredPosts} />}
    </div>
  );
};

export default ExploreContent;
