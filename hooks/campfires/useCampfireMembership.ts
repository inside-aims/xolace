import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const MEMBERSHIP_STALE_TIME = 2 * 60 * 1000; // 2 minutes (membership changes more frequently)
const MEMBERSHIP_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

interface CampfireMembershipParams {
  campfireId: string;
  userId: string;
}

/**
 * Hook to check if a user is a member of a specific campfire
 * 
 * This is separated for independent caching:
 * - Featured campfire data: cached 15-30 min (changes rarely)
 * - Membership status: cached 2-5 min (changes more often)
 * 
 * Benefits:
 * - When user joins/leaves, only membership cache invalidates
 * - Featured campfire stays cached
 * - Better performance and UX
 */
export function useCampfireMembership({ campfireId, userId }: CampfireMembershipParams) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<boolean, Error>({
    queryKey: ['campfire-membership', campfireId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campfire_members')
        .select('user_id')
        .eq('campfire_id', campfireId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error checking membership:', error);
        return false; // Fail gracefully
      }

      return !!data;
    },
    staleTime: MEMBERSHIP_STALE_TIME,
    gcTime: MEMBERSHIP_CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled: !!campfireId && !!userId,
  });
}

/**
 * Hook to check membership for multiple campfires at once
 * Useful when displaying a list of campfires
 */
export function useBatchCampfireMembership(campfireIds: string[], userId: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<Record<string, boolean>, Error>({
    queryKey: ['campfire-membership-batch', campfireIds, userId],
    queryFn: async () => {
      if (!campfireIds.length) return {};

      const { data, error } = await supabase
        .from('campfire_members')
        .select('campfire_id')
        .eq('user_id', userId)
        .in('campfire_id', campfireIds);

      if (error) {
        console.warn('Error checking batch membership:', error);
        return {};
      }

      // Create a map of campfireId -> isMember
      const membershipMap: Record<string, boolean> = {};
      campfireIds.forEach(id => {
        membershipMap[id] = data?.some(m => m.campfire_id === id) || false;
      });

      return membershipMap;
    },
    staleTime: MEMBERSHIP_STALE_TIME,
    gcTime: MEMBERSHIP_CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled: !!userId && campfireIds.length > 0,
  });
}