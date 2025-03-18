'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostCard } from '@/components/cards/PostCard';
import { cn } from '@/lib/utils';
import { Post } from '@/types/global';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  filteredPosts: Post[];
}

const ExploreFeedList = ({ filteredPosts }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  // Store post order in session storage when component mounts or posts change
  useEffect(() => {
    if (filteredPosts.length > 0) {
      const postOrder = filteredPosts.map(post => post.id);
      sessionStorage.setItem('explorePostOrder', JSON.stringify(postOrder));
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
            top: parseInt(scrollPosition),
            behavior: 'instant'
          });
          sessionStorage.removeItem('scrollPosition');
        }, 600);
      }
    }
  }, [pathname]);

  const handlePostClick = (postId: string) => {
    const currentScroll = window.scrollY.toString();
    sessionStorage.setItem('scrollPosition', currentScroll);
    router.push(`/post/${postId}`);
  };

  return (
    <>
      <motion.div layout className="mt-10 grid grid-cols-1 gap-6 w-full px-8">
        <AnimatePresence>
          {filteredPosts.length > 0 ? (
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
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ExploreFeedList;
