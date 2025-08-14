'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { LazyMotion, domAnimation } from 'motion/react';

import { EnhancedPostCard } from '../cards/EnhancedPostCard';
import BlurFade from '../ui/blur-fade';
import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSignedAvatarUrls } from '@/hooks/storage/useSignedUrl';
import { getEnhancedFeedPosts } from '@/queries/posts/getEnhancedFeed';
import { useUserState } from '@/lib/store/user';
import { useEnhancedRealtimePosts } from '@/hooks/posts/useEnhancedRealtimePosts';
import { DefaultLoader } from './loaders/DefaultLoader';
import { AlertCircle, Users, Clock } from 'lucide-react';
import { FeedEnhancedPostCard } from '../cards/FeedEnhancedPostCard';

/**
 * Enhanced Feed List with infinite scroll and smart prioritization
 */
const EnhancedFeedList = () => {
  const user = useUserState(state => state.user);
  const {
    posts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = getEnhancedFeedPosts(user?.id);

  const { data: signedUrls } = useSignedAvatarUrls(posts);
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Infinite scroll trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // States
  const [scrollableContainer, setScrollableContainer] = useState<HTMLElement | null>(null);

  // Real-time updates
  useEnhancedRealtimePosts();

  // Load more posts when intersection observer triggers
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Set up scrollable container
  useEffect(() => {
    const container = document.getElementById('feed-scroll-container');
    if (container) {
      setScrollableContainer(container);
    }
  }, []);

  // Handle scroll restoration (keep your existing logic)
  useEffect(() => {
    if (pathname === '/feed') {
      const savedContext = sessionStorage.getItem('feedViewContext');
      if (savedContext) {
        try {
          const viewContext = JSON.parse(savedContext);
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

            const lastPost = document.getElementById(viewContext.lastVisiblePost);
            if (lastPost) {
              lastPost.classList.add('briefly-highlight');
              setTimeout(() => lastPost.classList.remove('briefly-highlight'), 1500);
            }

            sessionStorage.removeItem('feedViewContext');
          }, 600);
        } catch (error) {
          sessionStorage.removeItem('feedViewContext');
        }
      }
    }
  }, [pathname, scrollableContainer, isDesktop]);

  // Handle post click (keep your existing logic)
  const handlePostClick = useCallback((postId: string) => {
    let viewContext = {};
    if (isDesktop) {
      if (!scrollableContainer) return;
      viewContext = {
        scrollY: scrollableContainer.scrollTop,
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
        scrollY: window.scrollY,
        timestamp: Date.now(),
        viewportHeight: window.innerHeight,
        lastVisiblePost:
          document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
        section: 'feed',
      };
    }

    sessionStorage.setItem('feedViewContext', JSON.stringify(viewContext));
    router.push(`/post/${postId}`);
  }, [isDesktop, scrollableContainer, router]);

  // Render priority indicator
//   const renderPriorityIndicator = (post: any) => {
//     if (post.is_new_post) {
//       return (
//         <div className="mb-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
//           <Clock className="h-3 w-3" />
//           <span className="font-medium">New</span>
//         </div>
//       );
//     }
    
//     if (post.is_campfire_post && post.campfire_name) {
//       return (
//         <div className="mb-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//           <Users className="h-3 w-3" />
//           <span className="font-medium">{post.campfire_name}</span>
//         </div>
//       );
//     }
    
//     return null;
//   };

  if (isLoading) {
    return <FeedSkeletonLoader />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load feed</h3>
        <p className="text-muted-foreground mb-4">{error?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground">
          Join some campfires or wait for new posts to appear in your feed!
        </p>
      </div>
    );
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
            {posts.map((post, index) => (
              <BlurFade
                key={post.id}
                postId={`post-${index + 1}`}
                duration={0.3}
                inView
              >
                <div>
                  {/* {renderPriorityIndicator(post)} */}
                  <FeedEnhancedPostCard
                    post={post}
                    onClick={() => handlePostClick(post.id)}
                    className="bg-bg dark:bg-bg-dark mb-5 w-full rounded-none border-x-0 md:w-full dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47]"
                    signedUrls={signedUrls}
                  />
                </div>
              </BlurFade>
            ))}

            {/* Infinite scroll loader */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DefaultLoader size={20} />
                  <span>Loading more posts...</span>
                </div>
              )}
              {!hasNextPage && posts.length > 0 && (
                <div className="text-center text-muted-foreground">
                  <p>You've reached the end!</p>
                  <p className="text-sm mt-1">No more posts to load.</p>
                </div>
              )}
            </div>
          </div>
        </BlurFade>
      </div>
    </LazyMotion>
  );
};

export default EnhancedFeedList;