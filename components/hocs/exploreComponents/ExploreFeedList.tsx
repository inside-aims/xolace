'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostCard } from '@/components/cards/PostCard';
import { cn } from '@/lib/utils';
import { Post } from '@/types/global';

interface Props {
  filteredPosts: Post[];
}

const ExploreFeedList = ({ filteredPosts }: Props) => {
  return (
    <>
      <motion.div layout className="mt-10 grid grid-cols-1 gap-6">
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
