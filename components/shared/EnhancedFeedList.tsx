'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { LazyMotion, domAnimation } from 'motion/react';

import BlurFade from '../ui/blur-fade';
import FeedSkeletonLoader from './loaders/FeedSkeletonLoader';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSignedAvatarUrls } from '@/hooks/storage/useSignedUrl';
import { getEnhancedFeedPosts } from '@/queries/posts/getEnhancedFeed';
import { useUserState } from '@/lib/store/user';
import { useEnhancedRealtimePosts } from '@/hooks/posts/useEnhancedRealtimePosts';
import { DefaultLoader } from './loaders/DefaultLoader';
import { AlertCircle, Users} from 'lucide-react';
import { FeedEnhancedPostCard } from '../cards/FeedEnhancedPostCard';
import { buildFeedItems, isFeedPost, isFeaturedCampfire } from '@/utils/feed/buildFeedItems';
import { useGetFeaturedCampfire } from '@/queries/posts/useGetFeaturedCampfire';
import { FEED_CONFIG } from '@/lib/feedConfig';
import { FeaturedCampfireCard } from '../cards/FeaturedCampfireCard';

/**
 * Enhanced Feed List with infinite scroll and smart prioritization
 */
const EnhancedFeedList = () => {
  const user = useUserState(state => state.user);
  const isUserLoading = useUserState(state => state.isLoading);

  const {
    posts,
    isPending: isPostsLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = getEnhancedFeedPosts(user?.id);

  // Fetch featured campfire (silently fails if unavailable)
  const { data: featuredCampfire } = useGetFeaturedCampfire(user?.id);

  const { data: signedUrls } = useSignedAvatarUrls(posts);
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Infinite scroll trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: FEED_CONFIG.INFINITE_SCROLL.THRESHOLD,
    rootMargin: FEED_CONFIG.INFINITE_SCROLL.ROOT_MARGIN,
  });

  // States
  const [scrollableContainer, setScrollableContainer] = useState<HTMLElement | null>(null);

  // Real-time updates
  useEnhancedRealtimePosts();

   /**
   * Build unified feed items array with featured campfires injected
   * Memoized for optimal performance - only recalculates when dependencies change
   */
   const feedItems = useMemo(() => {
    return buildFeedItems(posts, featuredCampfire);
  }, [posts, featuredCampfire]);

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
          
          // Wait for posts to load before restoring scroll
          if (posts.length > 0) {
            setTimeout(() => {
              if (isDesktop) {
                if (!scrollableContainer) return;
                scrollableContainer.scrollTo({
                  top: viewContext.scrollY,
                  behavior: 'instant',
                });
              } else {
                if (!scrollableContainer) return;
                scrollableContainer.scrollTo({
                  top: viewContext.scrollY,
                  behavior: 'instant',
                });
              }

              const lastPost = document.getElementById(viewContext.lastVisiblePost);
              if (lastPost) {
                lastPost.classList.add('briefly-highlight');
                setTimeout(() => lastPost.classList.remove('briefly-highlight'), FEED_CONFIG.SCROLL_RESTORATION.HIGHLIGHT_DURATION);
              }

              // Clean up after successful restoration
              sessionStorage.removeItem('feedViewContext');
            }, FEED_CONFIG.SCROLL_RESTORATION.DELAY);
          }
        } catch (_) {
          sessionStorage.removeItem('feedViewContext');
        }
      }
    }
  }, [pathname, scrollableContainer, isDesktop, posts.length]);

  // Handle post click
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
    const getScrollPosition = () => {
      const feedContainer = document.getElementById('feed-scroll-container') || document.querySelector('.main-container');
      const containerScrollTop = feedContainer?.scrollTop || 0;
      
      return containerScrollTop;
    };

     // Wait a bit for any momentum scrolling to settle
     requestAnimationFrame(() => {
      const finalScrollY = getScrollPosition();
      
      viewContext = {
        scrollY: finalScrollY,
        timestamp: Date.now(),
        viewportHeight: window.innerHeight,
        lastVisiblePost:
          document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
        section: 'feed',
      };

      sessionStorage.setItem('feedViewContext', JSON.stringify(viewContext));
      router.push(`/post/${postId}`);
    }); // Small delay to capture accurate scroll position
    
    return; // Exit early for mobile to prevent duplicate navigation
    }

    sessionStorage.setItem('feedViewContext', JSON.stringify(viewContext));
    router.push(`/post/${postId}`);
  }, [isDesktop, scrollableContainer, router]);

 // Show loading while user state is being determined or posts are loading
 const isLoading = isUserLoading || (user && isPostsLoading);

  if (isLoading) {
    return <FeedSkeletonLoader />;
  }

  // If no user after loading is complete, show appropriate message
  if (!isUserLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Authentication required</h3>
        <p className="text-muted-foreground mb-4">Please sign in to view your feed</p>
        <button
          onClick={() => router.push('/sign-in')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load feed</h3>
        <p className="text-muted-foreground mb-4">{error?.message}</p>
        <button
          onClick={() => refetch()}
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

        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Refresh Feed
        </button>
      </div>
    );
  }


  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col gap-4" id="feedList">
        <BlurFade>
          <div
            className="flex w-full flex-1 flex-col gap-3 pt-3 md:px-8"
            id="feedList"
            data-tour="feedList"
          >
            {feedItems.map((item) => (
              <BlurFade
                key={item.key}
                postId={`item-${item.index + 1}`}
                duration={0.3}
                inView
              >
                <div>
                  {isFeedPost(item) ? (
                    <FeedEnhancedPostCard
                      post={item.data}
                      onClick={() => handlePostClick(item.data.id)}
                      className="bg-bg dark:bg-bg-dark mb-5 w-full rounded-none border-x-0 md:w-full dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47]"
                      signedUrls={signedUrls}
                    />
                  ) : isFeaturedCampfire(item) ? (
                    <FeaturedCampfireCard
                      campfire={item.data}
                      className="mb-5 w-full md:w-full"
                    />
                  ) : null}
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
                  <p>You&apos;ve reached the end!</p>
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