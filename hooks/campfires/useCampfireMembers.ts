// hooks/campfires/useCampfireMembers.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const QUERY_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const QUERY_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export interface CampfireMember {
  user_id: string;
  username: string;
  avatar_url: string;
  role: 'firestarter' | 'firekeeper' | 'camper';
}

/**
 * Fetches members of a campfire by a list of roles and an optional limit.
 *
 * @param campfireId The UUID of the campfire.
 * @param roles An array of roles to filter by.
 * @param limit An optional number to limit the results.
 */
export function useCampfireMembers(
  campfireId?: string,
  roles: ('firestarter' | 'firekeeper')[] = ['firestarter', 'firekeeper'],
  limit = 6
) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireMember[], Error>({
    queryKey: ['campfire', 'members', campfireId, roles, limit],
    queryFn: async () => {
      if (!campfireId) {
        throw new Error('Campfire ID is required');
      }

      const { data, error } = await supabase.rpc('get_campfire_members_by_roles', {
        p_campfire_id: campfireId,
        p_roles: roles,
        p_limit: limit,
      });

      if (error) {
        console.error('Error fetching campfire members:', error);
        throw new Error(error.message);
      }

      return data as unknown as CampfireMember[];
    },
    enabled: !!campfireId,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}