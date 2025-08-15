// hooks/storage/useSignedUrls.ts
import {useMemo} from 'react';

import { useQuery } from '@tanstack/react-query';
import { getBatchSignedUrls } from '@/lib/actions/storage.actions';
import { Post } from '@/types/global';
import { EnhancedPost } from '@/queries/posts/getEnhancedFeed';

/**
 * A React Query hook to efficiently fetch a batch of signed URLs for post avatars.
 * @param posts - The array of posts from the initial feed query.
 * @returns The result of the React Query operation, containing a map of avatar paths to signed URLs.
 */
export const useSignedAvatarUrls = (posts: Post[] | EnhancedPost[] | undefined) => {
  // 1. Extract only the avatar paths that need a signed URL
  const avatarPaths = useMemo(() => {
    if (!posts) return [];

    return posts
      .filter(
        post =>
          // Check if the author is a professional AND the URL is a path, not a full http URL
          post.author_roles.includes('help_professional') &&
          post.author_avatar_url &&
          !post.author_avatar_url.startsWith('http'),
      )
      .map(post => post.author_avatar_url!); // The '!' is safe due to the filter
  }, [posts]);

  // 2. Use React Query to fetch the URLs in a batch
  return useQuery({
    queryKey: ['signedAvatarUrls', avatarPaths],
    queryFn: () => getBatchSignedUrls(avatarPaths),
    // Only run the query if there are actually paths to fetch
    enabled: avatarPaths.length > 0,
    // Keep the data fresh for 55 minutes to avoid re-fetching URLs that are valid for 60 mins
    staleTime: 1000 * 60 * 55,
    // Avoid refetching on window focus, as the URLs are long-lived
    refetchOnWindowFocus: false,
  });
};