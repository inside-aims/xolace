'use client';

import React, { useMemo } from 'react';

import FilterPills from '@/components/hocs/exploreComponents/FilterPills';
import { seededShuffleArray } from '@/lib/utils';
import LocalSearch from '@/components/shared/search/LocalSearch';
import ExploreFeedList from '@/components/hocs/exploreComponents/ExploreFeedList';
import { Post } from '@/types/global';
import { usePosts } from '@/hooks/posts/usePostsData';
import FeedSkeletonLoader from '@/components/shared/loaders/FeedSkeletonLoader';

interface ExploreContentProps {
  query: string;
  filter: string;
}


const filterPosts = (posts: Post[], filter: string) => {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  switch (filter) {
    case 'popular':
      return [...posts].sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
    case 'controversial':
      return [...posts].sort((a, b) => {
        const scoreA =
          (a.upvotes ?? 0) * 0.5 +
          (a.downvotes ?? 0) * 1.5 +
          (a.comments[0]?.count ?? 0) * 2;
        const scoreB =
          (b.upvotes ?? 0) * 0.5 +
          (b.downvotes ?? 0) * 1.5 +
          (b.comments[0]?.count ?? 0) * 2;
        return scoreB - scoreA;
      });
    case 'recent':
      return [...posts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    case 'trending':
      return [...posts].sort((a, b) => {
        const gravity = 1.8;
        const ageA = (Date.now() - new Date(a.created_at).getTime()) / 3600000; // age in hours
        const scoreA =
          ((a.upvotes ?? 0) +
            (a.views[0]?.count ?? 0) * 0.2 +
            (a.comments[0]?.count ?? 0) * 1.5) /
          Math.pow(ageA + 2, gravity);

        const ageB = (Date.now() - new Date(b.created_at).getTime()) / 3600000; // age in hours
        const scoreB =
          ((b.upvotes ?? 0) +
            (b.views[0]?.count ?? 0) * 0.2 +
            (b.comments[0]?.count ?? 0) * 1.5) /
          Math.pow(ageB + 2, gravity);

        return scoreB - scoreA;
      });
    default:
      return seededShuffleArray(posts, seed);
  }
};

const ExploreContent = ({ query, filter }: ExploreContentProps) => {
  const { data: queryPosts, isPending, isError, error } = usePosts();

  const filteredPosts = useMemo(() => {
    if (!queryPosts) return;
    const filtered = queryPosts.filter(post => {
      const matchQuery =
        query.toLowerCase() === '' ||
        post.author_name.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase());

      return matchQuery;
    });

    return filterPosts(filtered, filter);
  }, [queryPosts, query, filter]);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <LocalSearch
        placeholder="Search posts, authors, or topics..."
        otherClasses="flex-1"
        route="/explore"
      />

      <FilterPills />
      {isPending && <FeedSkeletonLoader />}

      {isError && <div>{error.message}</div>}
      {!isPending && !isError && !filteredPosts && <div>No posts found.</div>}
      {filteredPosts && <ExploreFeedList filteredPosts={filteredPosts} />}
    </div>
  );
};

export default ExploreContent;
