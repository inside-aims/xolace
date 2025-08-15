'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { EnhancedPostCard } from '../cards/EnhancedPostCard';
import FeedSkeletonLoader from '../shared/loaders/FeedSkeletonLoader';
import BlurFade from '../ui/blur-fade';
import { LazyMotion, domAnimation } from 'motion/react';
import { getCampfirePosts } from '@/queries/posts/getCampfirePosts';
import { useRealTimeCampfirePosts } from '@/hooks/posts/useRealTimeCampfirePosts';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSignedAvatarUrls } from '@/hooks/storage/useSignedUrl';

interface CampfireFeedListProps {
  campfireId: string;
  campfireName?: string;
  campfireIconUrl?: string;
}

/**
 * A component that displays campfire-specific posts with real-time updates
 */
const CampfireFeedList = ({ 
  campfireId, 
  campfireName, 
  campfireIconUrl 
}: CampfireFeedListProps) => {
  const { data: queryPosts, isPending, isError, error } = getCampfirePosts(campfireId);

  // Use signed URLs for professional avatars
  const { data: signedUrls } = useSignedAvatarUrls(queryPosts);

  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [scrollableContainer, setScrollableContainer] = useState<HTMLElement | null>(null);

  // Real-time updates for campfire posts
  useRealTimeCampfirePosts(campfireId);

  useEffect(() => {
    const container = document.getElementById('campfire-feed-scroll-container');
    if (container) {
      setScrollableContainer(container);
    }
  }, []);

  // Handle scroll restoration for campfire feeds
  useEffect(() => {
    if (pathname.includes('/campfires/')) {
      const savedContext = sessionStorage.getItem(`campfireFeedViewContext-${campfireId}`);
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

            sessionStorage.removeItem(`campfireFeedViewContext-${campfireId}`);
          }, 600);
        } catch (_) {
          sessionStorage.removeItem(`campfireFeedViewContext-${campfireId}`);
        }
      }
    }
  }, [pathname, scrollableContainer, isDesktop, campfireId]);

  const handlePostClick = (postId: string) => {
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
        section: 'campfire-feed',
        campfireId,
      };
    } else {
      viewContext = {
        scrollY: window.scrollY,
        timestamp: Date.now(),
        viewportHeight: window.innerHeight,
        lastVisiblePost:
          document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
        section: 'campfire-feed',
        campfireId,
      };
    }

    sessionStorage.setItem(`campfireFeedViewContext-${campfireId}`, JSON.stringify(viewContext));
    router.push(`/post/${postId}`);
  };

  if (isPending) {
    return <FeedSkeletonLoader />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Unable to load posts
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {error?.message || 'Something went wrong while loading campfire posts'}
          </p>
        </div>
      </div>
    );
  }

  if (!queryPosts || queryPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Be the first to share something with this campfire!
          </p>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col gap-4 w-full">
        <BlurFade>
          <div
            className="flex w-full flex-1 flex-col gap-3 pt-3 "
            id="campfireFeedList"
            data-tour="campfireFeedList"
          >
            {queryPosts.map((post, index) => (
              <BlurFade
                key={post.id}
                postId={`campfire-post-${index + 1}`}
                duration={0.3}
                inView
              >
                <EnhancedPostCard
                  post={post}
                  onClick={() => handlePostClick(post.id)}
                  className="bg-bg dark:bg-bg-dark mb-5 w-full rounded-none border-x-0 md:w-full dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47]"
                  signedUrls={signedUrls}
                  // Override author info with campfire info
                  campfireOverride={{
                    name: campfireName || post.campfires?.name || post.author_name,
                    iconUrl: campfireIconUrl || post.campfires?.icon_url || post.author_avatar_url,
                    slug: post.campfires?.slug
                  }}
                />
              </BlurFade>
            ))}
          </div>
        </BlurFade>
      </div>
    </LazyMotion>
  );
};

export default CampfireFeedList;