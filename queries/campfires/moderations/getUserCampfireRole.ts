// queries/campfires/getCampfireWithSlug.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export interface CampfireRole {
  role: string;

}

const QUERY_STALE_TIME = 30 * 60 * 1000; // 30 minutes
const QUERY_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function getUserCampfireRole(campfireId: string, userId: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireRole, Error>({
    queryKey: ['campfires', 'members', campfireId, userId],
    queryFn: async () => {
      // Build the query with conditional left join for membership
      let query = supabase
        .from('campfire_members')
        .select(
          `
          role
        `,
        )
        .eq('campfire_id', campfireId)
        .eq('user_id', userId)
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
        role: campfireData.role,
        
      } as CampfireRole;
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!campfireId && !!userId, // Only require campfireId and userId
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