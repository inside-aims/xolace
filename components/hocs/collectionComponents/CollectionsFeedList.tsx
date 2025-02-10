'use client';

import React, { useEffect } from 'react';
import { PostCard } from '@/components/cards/PostCard';
import { Post } from '@/types/global';
import { useRouter, usePathname } from 'next/navigation';
import NothingInVoid from '@/components/shared/NotFound/NothingInVoid';

interface CollectionsFeedListProps {
  postsData: Post[];
  isLoading: boolean;
}

const CollectionsFeedList = ({ postsData, isLoading }: CollectionsFeedListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  //   const loadPosts = async (currentPage: number) => {
  //     const data = await fetchCollectionPostsAction(userId, collectionName, currentPage, pageSize);
  //     if (currentPage === 1) {
  //       setPosts(data);
  //     } else {
  //       setPosts(prevPosts => [...prevPosts, ...data]);
  //     }
  //     setHasMore(data.length === pageSize);
  //   };

  //   useEffect(() => {
  //     loadPosts(1);
  //   }, [userId, collectionName]);

  //   const handleLoadMore = () => {
  //     const nextPage = page + 1;
  //     setPage(nextPage);
  //     loadPosts(nextPage);
  //   };

  // Handle scroll restoration
  useEffect(() => {
    if (pathname === '/collections') {
      const savedContext = sessionStorage.getItem('CollectionFeedViewContext');
      if (savedContext) {
        try {
          const viewContext = JSON.parse(savedContext);
          // Wait for animations to complete (500ms) plus a small buffer
          setTimeout(() => {
          window.scrollTo({
            top: viewContext.scrollY,
            behavior: 'instant',
          });

          // Highlight last visible post if it exists
          const lastPost = document.getElementById(viewContext.lastVisiblePost);
          if (lastPost) {
            lastPost.classList.add('briefly-highlight');
            setTimeout(
              () => lastPost.classList.remove('briefly-highlight'),
              1500,
            );
          }

          sessionStorage.removeItem('CollectionFeedViewContext');
        }, 500);
        } catch (error) {
          sessionStorage.removeItem('CollectionFeedViewContext');
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
      lastVisiblePost:
        document.elementFromPoint(0, window.innerHeight - 10)?.id || postId,
      section: 'collection',
    };

    sessionStorage.setItem(
      'CollectionFeedViewContext',
      JSON.stringify(viewContext),
    );
    router.push(`/post/${postId}`);
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      {!isLoading && postsData.length > 0 &&
      postsData.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => handlePostClick(post.id)}
          className={`mb-5 w-full bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%),hsl(0_0%_90%)_90%),linear-gradient(to_bottom_right,hsl(0_0%_98%),hsl(0_0%_96%))] hover:bg-[radial-gradient(ellipse_at_top,hsl(0_0%_95%),hsl(0_0%_98%)_90%),linear-gradient(to_bottom_right,hsl(0_0%_99%),hsl(0_0%_97%))] dark:bg-[radial-gradient(ellipse_at_top,hsl(228_85%_15%),transparent),linear-gradient(to_bottom_right,hsl(228_85%_7%),hsl(228_65%_3%))] ring-1 ring-black/[0.03] transition duration-300 hover:ring-black/[0.05] dark:hover:bg-[radial-gradient(ellipse_at_top,hsl(228_80%_10%),transparent),linear-gradient(to_bottom_right,hsl(228_85%_18%),hsl(228_85%_10%))] dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47] md:w-full`}
        />
      ))
      }

      {
        !isLoading && postsData.length === 0 && (
            <div className="flex w-full flex-1 flex-col justify-center items-center gap-5 py-10">
            <NothingInVoid/>
            <p className=' text-gray-400 text-sm'>Nothing found in the Void </p>
          </div>
        )
      }
    </div>
  );
};

export default CollectionsFeedList;
