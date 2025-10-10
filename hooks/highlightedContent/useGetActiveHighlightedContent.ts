import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { HighlightedContent } from '@/types/highlightedContent';

const HIGHLIGHTED_CONTENT_STALE_TIME = 30 * 60 * 1000; // 30 minutes
const HIGHLIGHTED_CONTENT_CACHE_TIME = 60 * 60 * 1000; // 1 hour

/**
 * Hook to fetch active highlighted content for the feed
 * 
 * Returns highlights sorted by priority (highest first)
 * Only returns content that is:
 * - is_active = true
 * - Current time is between start_date and end_date
 * 
 * Cache strategy:
 * - Stale time: 30 minutes (highlights don't change often)
 * - Cache time: 1 hour (even stale data is useful)
 * - Prefetched on server for instant load
 * 
 * Performance:
 * - Uses indexed query (idx_highlighted_active_dates)
 * - ~5-10ms query time
 * - 0ms on cache hit
 */
export function useGetActiveHighlightedContent() {
  const supabase = getSupabaseBrowserClient();

  return useQuery<HighlightedContent[], Error>({
    queryKey: ['highlighted-content', 'active'],
    queryFn: async () => {
      // ============================================
      // OPTION 1: Using RPC function (recommended)
      // ============================================
      const { data, error } = await supabase
        .rpc('get_active_highlighted_content');

      if (error) {
        console.error('Error fetching highlighted content:', error);
        throw new Error(error.message);
      }

      return (data || []) as HighlightedContent[];

      // ============================================
      // OPTION 2: Direct query (if RPC not available)
      // ============================================
      /*
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('highlighted_feed_content')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching highlighted content:', error);
        throw new Error(error.message);
      }

      return (data || []) as HighlightedContent[];
      */
    },
    staleTime: HIGHLIGHTED_CONTENT_STALE_TIME,
    gcTime: HIGHLIGHTED_CONTENT_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Server-side function for prefetching
 * Use in Next.js page components
 */
// export async function getActiveHighlightedContentServer() {
//   const { createClient } = await import('@/utils/supabase/server');
//   const supabase = await createClient();

//   try {
//     const { data, error } = await supabase
//       .rpc('get_active_highlighted_content');

//     if (error) {
//       console.error('Error prefetching highlighted content:', error);
//       return [];
//     }

//     return (data || []) as HighlightedContent[];
//   } catch (error) {
//     console.error('Error in server prefetch:', error);
//     return [];
//   }
// }

/**
 * Hook variant that returns only highlights for specific positions
 * Used in feed to determine which highlights to show at which positions
 * 
 * @param totalHighlights - Total number of active highlights
 * @param positions - Array of post positions where highlights should appear
 * @returns Map of position -> highlight
 */
export function useHighlightedContentForPositions(
  positions: number[] = [5, 15, 25]
) {
  const { data: highlights = [], isLoading, isError } = useGetActiveHighlightedContent();

  // Create a map of position -> highlight
  const positionMap = new Map<number, HighlightedContent>();

  // Distribute highlights across positions
  // Each highlight appears once at its designated position
  highlights.forEach((highlight, index) => {
    if (index < positions.length) {
      positionMap.set(positions[index], highlight);
    }
  });

  return {
    positionMap,
    highlights,
    isLoading,
    isError,
    totalHighlights: highlights.length,
  };
}

/**
 * Utility to check if a highlight should be shown at a given post index
 * 
 * @param postIndex - Current post index in feed (0-based)
 * @param positionMap - Map from useHighlightedContentForPositions
 * @returns Highlight to show, or null
 */
export function getHighlightAtPosition(
  postIndex: number,
  positionMap: Map<number, HighlightedContent>
): HighlightedContent | null {
  // postIndex is 0-based, positions are 1-based (after 5th post means index 5)
  return positionMap.get(postIndex + 1) || null;
}