"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "@/components/PostCard";

const key = "mood-"
interface Props {
  filteredPosts: {
    id: string;
    author_name: string;
    author_avatar_url: string;
    content: string;
    timestamp: string;
    mood: {
      emoji: string;
      style: string;
      name: string;
    };
    expires_in_24hr: boolean;
    upvotes: number;
    downvotes: number;
    comments: number;
  }[];
}

const ExploreFeedList = ({ filteredPosts }: Props) => {
  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-1  gap-6 mt-10"
      >
        <AnimatePresence>
          {filteredPosts.length > 0 ? (
            filteredPosts?.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard post={post} className={``} />
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
