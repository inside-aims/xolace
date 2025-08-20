// hooks/storage/useSignedUrls.ts
import {useMemo} from 'react';

import { useQuery } from '@tanstack/react-query';
import { getBatchSignedUrls } from '@/lib/actions/storage.actions';
import { Comment, NestedComment } from '@/types/global';

/**
 * A React Query hook to efficiently fetch a batch of signed URLs for post avatars.
 * @param comments - The array of comments from the initial feed query.
 * @returns The result of the React Query operation, containing a map of avatar paths to signed URLs.
 */
export const useCommentSignedUrls = (comments: Comment[] | NestedComment[] | undefined) => {
  // 1. Extract only the avatar paths that need a signed URL
  const avatarPaths = useMemo(() => {
    if (!comments) return [];

    return comments
      .filter(
        comment =>
          // Check if the author is a professional AND the URL is a path, not a full http URL
          comment.author_avatar_url &&
          !comment.author_avatar_url.startsWith('http'),
      )
      .map(comment => comment.author_avatar_url!); // The '!' is safe due to the filter
  }, [comments]);

  // 2. Use React Query to fetch the URLs in a batch
  return useQuery({
    queryKey: ['commentSignedUrls', avatarPaths],
    queryFn: () => getBatchSignedUrls(avatarPaths),
    // Only run the query if there are actually paths to fetch
    enabled: avatarPaths.length > 0,
    // Keep the data fresh for 55 minutes to avoid re-fetching URLs that are valid for 60 mins
    staleTime: 1000 * 60 * 55,
    // Avoid refetching on window focus, as the URLs are long-lived
    refetchOnWindowFocus: false,
  });
};