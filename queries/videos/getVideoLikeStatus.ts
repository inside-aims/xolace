

import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { fetchUserVideoLike } from '@/lib/actions/videoLikes.action';

const supabase = getSupabaseBrowserClient();

/**
 * Fetches data for a single video by its ID.
 * @param videoId The unique identifier for the video.
 */
export function getVideoLikeStatus(videoId: string, userId: string) {
  return useQuery({
    // The query key is an array that uniquely identifies this query.
    // Including the videoId ensures that different videos have different cache entries.
    queryKey: ['videoLikedStatus', videoId, userId],
    
    queryFn: async () => fetchUserVideoLike(userId, videoId),
    
    // This query is enabled only if a videoId is provided.
    enabled: !!userId && !!videoId, 
  });
}