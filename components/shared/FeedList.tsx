'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { EnhancedPostCard } from '../cards/EnhancedPostCard';
//import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';
import BlurFade from '../ui/blur-fade';
//import { Post } from '@/types/global';
import { LazyMotion, domAnimation } from 'motion/react';
import { usePosts } from '@/hooks/posts/usePostsData';
import { useRealtimePosts } from '@/hooks/posts/useRealTimePosts';
import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';
import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * A component that displays a list of posts, with real-time updates and scroll restoration.
 *
 * @returns A component that displays a list of posts.
 */
const FeedList = () => {
  const { data: queryPosts, isPending, isError, error } = usePosts();

  //const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();

  const isDesktop = useMediaQuery('(min-width: 768px)');

  // states
  const [scrollableContainer, setScrollableContainer] =
    useState<HTMLElement | null>(null);

  useRealtimePosts(); // use real time updates

  useEffect(() => {
    // Get the scrollable container once the component mounts
    const container = document.getElementById('feed-scroll-container');
    if (container) {
      setScrollableContainer(container);
    }
  }, []);

  // Handle scroll restoration
  useEffect(() => {
    if (pathname === '/feed') {
      const savedContext = sessionStorage.getItem('feedViewContext');
      if (savedContext) {
        try {
          const viewContext = JSON.parse(savedContext);
          // Wait for animations to complete (500ms) plus a small buffer
          setTimeout(() => {
            if (isDesktop) {
              if (!scrollableContainer) return;
              scrollableContainer.scrollTo({
                top: viewContext.scrollY,
                behavior: 'instant',
              });
            } else {
              window.scrollTo({
                top: viewContext.scrollY,
                behavior: 'instant',
              });
            }

            // Highlight last visible post if it exists
            const lastPost = document.getElementById(
              viewContext.lastVisiblePost,
            );
            if (lastPost) {
              lastPost.classList.add('briefly-highlight');
              setTimeout(
                () => lastPost.classList.remove('briefly-highlight'),
                1500,
              );
            }

            sessionStorage.removeItem('feedViewContext');
          }, 600);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          sessionStorage.removeItem('feedViewContext');
        }
      }
    }
  }, [pathname, scrollableContainer, isDesktop]);

  /**
   * Handles the click event on a post, saving the current scroll position
   * and other view context information to session storage before navigating
   * to the post's detail page.
   *
   * @param postId - The ID of the post to navigate to.
   */
  const handlePostClick = (postId: string) => {
    let viewContext = {};
    if (isDesktop) {
      if (!scrollableContainer) return;
      viewContext = {
        scrollY: scrollableContainer.scrollTop, // should use window. on mobile view
        timestamp: Date.now(),
        viewportHeight: scrollableContainer.clientHeight,
        lastVisiblePost:
          document.elementFromPoint(
            0,
            scrollableContainer.getBoundingClientRect().bottom - 10,
          )?.id || postId,
        section: 'feed',
      };
    } else {
      viewContext = {
        scrollY: window.scrollY, // should use window. on mobile view
        timestamp: Date.now(),
        viewportHeight: window.innerHeight,
        lastVisiblePost:
          document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
        section: 'feed',
      };
    }

    sessionStorage.setItem('feedViewContext', JSON.stringify(viewContext));
    router.push(`/post/${postId}`);
  };

  if (isPending) {
    return <FeedSkeletonLoader />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col gap-4">
        <BlurFade>
          <div
            className="flex w-full flex-1 flex-col gap-3 pt-3 md:px-8"
            id="feedList"
            data-tour="feedList"
          >
            {Array.isArray(queryPosts) &&
              queryPosts.map((post, index) => (
                <BlurFade
                  key={post.id}
                  postId={`post-${index + 1}`}
                  duration={0.3}
                  inView
                >
                  <EnhancedPostCard
                    post={post}
                    onClick={() => handlePostClick(post.id)}
                    className="bg-bg dark:bg-bg-dark mb-5 w-full rounded-none border-x-0 md:w-full dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47]"
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
