'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
//import { PostCard } from '@/components/cards/PostCard';
import { cn } from '@/lib/utils';
import { Post } from '@/types/global';
import { usePathname, useRouter } from 'next/navigation';
import { FeedSkeletonCard } from '@/components/shared/loaders/FeedSkeletonLoader';


const PostCard = dynamic(
  () => import('@/components/cards/PostCard').then(mod => mod.PostCard),
  {
    ssr: false,
    loading: () => <FeedSkeletonCard />, // Placeholder
  },
);

const SearchLoader = dynamic(
  () => import('@/components/shared/loaders/SearchLoader'),
  {
    ssr: false,
  },
);

interface Props {
  filteredPosts: Post[];
}

const ExploreFeedList = ({ filteredPosts }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  // Store post order in session storage when component mounts or posts change
  useEffect(() => {
    if (filteredPosts.length > 0) {
      const storedOrder = sessionStorage.getItem('explorePostOrder');
      const newOrder = JSON.stringify(filteredPosts.map(post => post.id));

      if (storedOrder !== newOrder) {
        sessionStorage.setItem('explorePostOrder', newOrder);
      }
    }
  }, [filteredPosts]);

  // Handle scroll restoration and post order
  useEffect(() => {
    if (pathname === '/explore') {
      const scrollPosition = sessionStorage.getItem('scrollPosition');
      //const storedPostOrder = sessionStorage.getItem('explorePostOrder');

      if (scrollPosition) {
        // Wait for animations to complete (500ms) plus a small buffer
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(scrollPosition, 10),
            behavior: 'instant',
          });
          sessionStorage.removeItem('scrollPosition');
        }, 500);
      }
    }
  }, [pathname]);

  // const handlePostClick = (postId: string) => {
  //   const currentScroll = window.scrollY.toString();
  //   sessionStorage.setItem('scrollPosition', currentScroll);
  //   router.push(`/post/${postId}`);
  // };

  const handlePostClick = useCallback(
    (postId: string) => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      router.push(`/post/${postId}`);
    },
    [router],
  );

  const renderedPosts = useMemo(
    () =>
      filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard
              post={post}
              className={cn(
                'mb-3 w-full overflow-hidden transition-colors duration-300',
              )}
              onClick={() => handlePostClick(post.id)}
            />
          </motion.div>
        ))
      ) : (
        <SearchLoader title='No posts found' description='Try adjusting your search or filters'/>
      ),
    [filteredPosts, handlePostClick],
  );

  return (
    <>
      <motion.div
        layout
        className="mt-10 mb-10 grid w-full grid-cols-1 gap-6 md:px-8"
      >
        <AnimatePresence>
          {renderedPosts}
          {/* {filteredPosts.length > 0 ? (
            filteredPosts?.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard
                  post={post}
                  className={cn(
                    `mood-${post.mood}`,
                    'mb-5 w-full overflow-hidden transition-colors duration-300',
                  )}
                  onClick={() => handlePostClick(post.id)}
                />
              </motion.div>
            ))
          ) : (
            <p>No posts found.</p>
            moodColors[post.mood] as keyof typeof moodColors
          )} */}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ExploreFeedList;
