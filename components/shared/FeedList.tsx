/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { PostCard } from '@/components/cards/PostCard';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';
import BlurFade from '../ui/blur-fade';
import { Post } from '@/types/global';

const FeedList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchPost = async () => {
      const postStatement = supabase
        .from('posts')
        .select(
          `
     *,
     posttags (
        tags (
          name
        )
      ),
        likes(
        *
        ),
        comments:comments(count),
        views:views(count)
  `,
        )
        .order('created_at', { ascending: false });
      const { data: postsData, error } = await postStatement;

      if (error) {
        console.error('Error fetching posts:', error.message);
        return;
      }

      setPosts(postsData);
      setIsLoading(false);
      
      // After posts are loaded, check if we need to restore scroll
      if (shouldRestoreScroll) {
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
          // Wait for animations to complete (500ms) plus a small buffer
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(scrollPosition),
              behavior: 'instant'
            });
            sessionStorage.removeItem('scrollPosition');
            setShouldRestoreScroll(false);
          }, 600);
        }
      }
    };

    fetchPost();
  }, [supabase, shouldRestoreScroll]);

  useEffect(() => {
    if (pathname === '/feed') {
      const hasScrollPosition = sessionStorage.getItem('scrollPosition') !== null;
      if (hasScrollPosition) {
        setShouldRestoreScroll(true);
      }
    }
  }, [pathname]);

  const handlePostClick = (postId: string) => {
    const currentScroll = window.scrollY.toString();
    console.log('Saving scroll position:', currentScroll);
    sessionStorage.setItem('scrollPosition', currentScroll);
    router.push(`/post/${postId}`);
  };

  // real time events for post
  useEffect((): any => {
    const listener = (payload: any) => {
      const eventType = payload.eventType;

      console.log('eventType', payload);

      if (eventType === 'INSERT') {
        console.log('Inserting post');
      } else if (eventType === 'DELETE') {
        setPosts((prevPosts: any) =>
          prevPosts.filter((post: any) => post.id !== payload.old.id),
        );
      } else if (eventType === 'UPDATE') {
        setPosts((prevPosts: any) =>
          prevPosts.map((post: any) =>
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
          // filter: `ticket=eq.${ticket}`,
        },
        listener,
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [supabase]);

  console.log(
    'posts -> ',
    posts?.map(test => test),
  );

  return (
    <div className="flex flex-col gap-4">
      <BlurFade>
        {isLoading ? (
          <FeedSkeletonLoader />
        ) : (
          <div className="flex w-full flex-1 flex-col gap-3">
            {posts.map((post) => (
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
        )}
      </BlurFade>
    </div>
  );
};

export default FeedList;
