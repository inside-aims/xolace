import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const supabase = getSupabaseBrowserClient();

/**
 * Fetches data for a single video by its ID.
 * @param videoId The unique identifier for the video.
 */
export function getVideoData(videoId: string) {
  return useQuery({
    // The query key is an array that uniquely identifies this query.
    // Including the videoId ensures that different videos have different cache entries.
    queryKey: ['video', videoId],
    
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*') // Selects all columns
        .eq('video_id', videoId) // Filters for the specific video
        .single(); // Expects a single row, throwing an error if 0 or more than 1 are found.

      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    
    // This query is enabled only if a videoId is provided.
    enabled: !!videoId, 
  });
}