'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, ThumbsUp, Flame, Clock } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import FilterPills from '@/components/hocs/exploreComponents/FilterPills';

// Mock data generation (replace with actual API call in production)
const generateMockPosts = (count: number) => {
  const moods = [
    { emoji: '😊', style: 'bg-green-100 dark:bg-green-900', name: 'happy' },
    { emoji: '😢', style: 'bg-blue-100 dark:bg-blue-900', name: 'sad' },
    { emoji: '😠', style: 'bg-red-100 dark:bg-red-900', name: 'angry' },
    { emoji: '🤔', style: 'bg-yellow-100 dark:bg-yellow-900', name: 'confused' },
    { emoji: '😐', style: 'bg-gray-100 dark:bg-gray-800', name: 'neutral' },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    author_name: `User ${i + 1}`,
    author_avatar_url: `/placeholder.svg?height=40&width=40`,
    content: `This is a sample post content for post number ${i + 1}. It can be quite long and might need truncation in the UI.`,
    timestamp: `${Math.floor(Math.random() * 24)}h ago`,
    mood: moods[Math.floor(Math.random() * moods.length)],
    expires_in_24hr: Math.random() > 0.5,
    upvotes: Math.floor(Math.random() * 1000),
    downvotes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
  }));
};

const ExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const filters = [
    { name: 'trending', label: 'Trending', icon: <Zap size={16} /> },
    { name: 'popular', label: 'Popular', icon: <ThumbsUp size={16} /> },
    { name: 'controversial', label: 'Spicy', icon: <Flame size={16} /> },
    { name: 'recent', label: 'Fresh', icon: <Clock size={16} /> },
  ];

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const filterPosts = (posts: any[]) => {
    let filteredPosts = posts.filter(post =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeFilter) {
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

  const filteredPosts = filterPosts(posts);

  // Randomize posts on component mount and when activeFilter changes
  useEffect(() => {
    setPosts(generateMockPosts(50));
  }, []);

  return (
    <>

      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Explore the Shadows</h1>
        
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <FilterPills
            filters={filters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

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
      </div>
    </>
  );
};

export default ExplorePage;

