/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { PostCard } from '@/components/cards/PostCard';
//import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';
import BlurFade from '../ui/blur-fade';
import { Post } from '@/types/global';
import { LazyMotion, domAnimation } from 'framer-motion';
import { usePosts } from '@/hooks/posts/usePostsData';
import { useRealtimePosts } from '@/hooks/posts/useRealTimePosts';
import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';


  /**
   * A component that displays a list of posts, with real-time updates and scroll restoration.
   *
   * @returns A component that displays a list of posts.
   */
const FeedList = () => {
  const { data: queryPosts, isPending, isError, error } = usePosts();
  //
  //const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();

  useRealtimePosts() // use real time updates
  // Handle real-time updates
  // useEffect((): any => {
  //   const listener = (payload: any) => {
  //     const eventType = payload.eventType;

  //     if (eventType === 'INSERT') {
  //       setPosts(prevPosts => [payload.new, ...prevPosts]);
  //     } else if (eventType === 'DELETE') {
  //       setPosts(prevPosts =>
  //         prevPosts.filter(post => post.id !== payload.old.id),
  //       );
  //     }
  //     // else if (eventType === 'UPDATE') {
  //     //   setPosts(prevPosts =>
  //     //     prevPosts.map(post =>
  //     //       post.id === payload.new.id ? payload.new : post,
  //     //     ),
  //     //   );
  //     //   console.log(payload.new)
  //     // }
  //   };

  //   const subscription = supabase
  //     .channel('public:posts')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'posts',
  //       },
  //       listener,
  //     )
  //     .subscribe();

  //   return () => subscription.unsubscribe();
  // }, [supabase]);

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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
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

  if(isPending){
    return <FeedSkeletonLoader/>
  }

if(isError){
  return <div>{error.message}</div>
}


  return (
    <LazyMotion features={domAnimation}>
    <div className="flex flex-col gap-4" >
      <BlurFade>
        <div className="flex w-full flex-1 flex-col gap-3 pt-3 md:px-8" id='feedList' data-tour="feedList" >
          {Array.isArray(queryPosts) && queryPosts.map((post, index) => (
            <BlurFade
              key={post.id}
              postId={`post-${index + 1}`}
              duration={0.3}
              inView
            >
              <PostCard
                post={post}
                onClick={() => handlePostClick(post.id)}
                className="rounded-none mb-5 w-full bg-bg dark:bg-bg-dark dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47] md:w-full border-x-0"
              />
            </BlurFade>
          ))}
        </div>
      </BlurFade>
    </div> 
    </LazyMotion>
  );
};

export default FeedList;
