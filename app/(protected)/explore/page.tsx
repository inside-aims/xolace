

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/PostCard';
import FilterPills from '@/components/hocs/exploreComponents/FilterPills';
import { generateMockPosts } from '@/constants/generateMockPosts';
import { shuffleArray } from '@/lib/utils';
import LocalSearch from '@/components/shared/search/LocalSearch';

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const filterPosts = (filteredPosts: any[], filter: string) => {

  switch (filter) {
    case 'popular':
      filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
      break;
    case 'controversial':
      filteredPosts.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
      break;
    case 'recent':
      filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
  const posts = generateMockPosts(50)
  const { query = "", filter = "" } = await searchParams;


  
  let filteredPosts = posts.filter((post) => {
    const matchQuery =
      query?.toLowerCase() === "" ||
      post.author_name.toLowerCase().includes(query?.toLowerCase()) ||
      post.content.toLowerCase().includes(query?.toLowerCase());
     

    const matchFilter = filter
      ?true
      : true;

    return matchQuery && matchFilter;
  });

filteredPosts = filterPosts(filteredPosts, filter)
  


  return (
    <>

        <section className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Explore the Shadows</h1>
        </section>
        
        <section className="mt-12">
          <LocalSearch
           placeholder="Search questions..."
           otherClasses="flex-1"
           route="/explore"
          />
        
        </section>

        <FilterPills/>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <PostCard post={post} className={post.mood.style} />
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

export default ExplorePage;

