/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { PostCard } from '@/components/cards/PostCard';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
//import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';
import BlurFade from '../ui/blur-fade';
import { Post } from '@/types/global';

interface FeedListProps {
  initialPosts: Post[];
}

const FeedList = ({ initialPosts }: FeedListProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();

  // Handle real-time updates
  useEffect((): any => {
    const listener = (payload: any) => {
      const eventType = payload.eventType;

      if (eventType === 'INSERT') {
        setPosts(prevPosts => [payload.new, ...prevPosts]);
      } else if (eventType === 'DELETE') {
        setPosts(prevPosts =>
          prevPosts.filter(post => post.id !== payload.old.id),
        );
      } else if (eventType === 'UPDATE') {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === payload.new.id ? payload.new : post,
          ),
        );
      }
    };

    const subscription = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        listener,
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Handle scroll restoration
  useEffect(() => {
    if (pathname === '/feed') {
      const scrollPosition = sessionStorage.getItem('scrollPosition');
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
    <div className="flex flex-col gap-4">
      <BlurFade>
        <div className="flex w-full flex-1 flex-col gap-3">
          {Array.isArray(posts) && posts.map((post) => (
            <BlurFade
              key={post.id}
              duration={0.3}
              inView
            >
              <PostCard
                post={post}
                onClick={() => handlePostClick(post.id)}
                className="mb-5 w-full ring-1 ring-white/[0.05] transition duration-300 dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47] md:w-full"
              />
            </BlurFade>
          ))}
        </div>
      </BlurFade>
    </div>
  );
};

export default FeedList;
