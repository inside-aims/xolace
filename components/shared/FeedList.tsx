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

  /**
   * A component that displays a list of posts, with real-time updates and scroll restoration.
   *
   * @param initialPosts - The initial list of posts to display.
   * @returns A component that displays a list of posts.
   */
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
      const savedContext = sessionStorage.getItem('feedViewContext');
      if (savedContext) {
        try {
          const viewContext = JSON.parse(savedContext);
          // Wait for animations to complete (500ms) plus a small buffer
          setTimeout(() => {
            window.scrollTo({
              top: viewContext.scrollY,
              behavior: 'instant'
            });
            
            // Highlight last visible post if it exists
            const lastPost = document.getElementById(viewContext.lastVisiblePost);
            if (lastPost) {
              lastPost.classList.add('briefly-highlight');
              setTimeout(() => lastPost.classList.remove('briefly-highlight'), 1500);
            }
            
            sessionStorage.removeItem('feedViewContext');
          }, 600);
        } catch (error) {
          console.error('Error restoring feed position:', error);
          sessionStorage.removeItem('feedViewContext');
        }
      }
    }
  }, [pathname]);

  /**
   * Handles the click event on a post, saving the current scroll position 
   * and other view context information to session storage before navigating 
   * to the post's detail page.
   * 
   * @param postId - The ID of the post to navigate to.
   */
  const handlePostClick = (postId: string) => {
    const viewContext = {
      scrollY: window.scrollY,
      timestamp: Date.now(),
      viewportHeight: window.innerHeight,
      lastVisiblePost: document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
      section: 'feed'
    };

    sessionStorage.setItem('feedViewContext', JSON.stringify(viewContext));
    router.push(`/post/${postId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <BlurFade>
        <div className="flex w-full flex-1 flex-col gap-3 pt-3">
          {Array.isArray(posts) && posts.map((post) => (
            <BlurFade
              key={post.id}
              duration={0.3}
              inView
            >
              <PostCard
                post={post}
                onClick={() => handlePostClick(post.id)}
                className="mb-5 w-full dark:bg-[radial-gradient(ellipse_at_top,hsl(228_85%_8%),transparent),linear-gradient(to_bottom_right,hsl(228_85%_7%),hsl(228_85%_3%))] ring-1 ring-white/[0.05] transition duration-300 dark:hover:bg-[radial-gradient(ellipse_at_top,hsl(228_85%_6%),transparent),linear-gradient(to_bottom_right,hsl(228_85%_8%),hsl(228_85%_4%))] dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47] md:w-full"
              />
            </BlurFade>
          ))}
        </div>
      </BlurFade>
    </div>
  );
};

export default FeedList;
