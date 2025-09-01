// queries/campfires/getCampfireWithSlug.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfirePurpose } from '@/components/campfires/campfires.types';

export interface CampfireId {
  campfireId: string;

}

const QUERY_STALE_TIME = 30 * 60 * 1000; // 30 minutes
const QUERY_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function getCampfireIdWithSlug(slug: string, userId?: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireId, Error>({
    queryKey: ['campfireId', 'public', slug, userId],
    queryFn: async () => {
      // Build the query with conditional left join for membership
      let query = supabase
        .from('campfires')
        .select(
          `
          id
        `,
        )
        .eq('visibility', 'public')
        .eq('slug', slug)
        .single();

      const { data: campfireData, error: campfireError } = await query;

      if (campfireError) {
        console.error('Error fetching campfire details:', campfireError);
        throw new Error(campfireError.message);
      }

      if (!campfireData) {
        throw new Error('Campfire not found');
      }

    

      return {
        campfireId: campfireData.id,
        
      } as CampfireId;
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!slug, // Only require slug, not userId
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry if campfire not found
      if (error.message.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}