// hooks/campfires/useCampfireMembers.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const QUERY_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const QUERY_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export interface CampfireMember {
  id: string;
  campfire_id: string;
  user_id: string;
  role: 'camper' | 'moderator' | 'admin';
  joined_at: string;
  username: string;
  profile_pic: string | null;
  display_name: string | null;
}

export function useCampfireMembers(campfireId?: string, limit?: number) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireMember[], Error>({
    queryKey: ['campfire', 'members', campfireId, limit],
    queryFn: async () => {
      if (!campfireId) throw new Error('Campfire ID is required');

      let query = supabase
        .from('campfire_members')
        .select(`
          id,
          campfire_id,
          user_id,
          role,
          joined_at,
          profiles!campfire_members_user_id_fkey (
            username,
            profile_pic,
            display_name
          )
        `)
        .eq('campfire_id', campfireId)
        .order('joined_at', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching campfire members:', error);
        throw new Error(error.message);
      }

      // Transform the data to flatten the profile information
      const transformedData = (data || []).map((member: any) => ({
        id: member.id,
        campfire_id: member.campfire_id,
        user_id: member.user_id,
        role: member.role,
        joined_at: member.joined_at,
        username: member.profiles?.username || 'Anonymous',
        profile_pic: member.profiles?.profile_pic,
        display_name: member.profiles?.display_name,
      }));

      return transformedData;
    },
    enabled: !!campfireId,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}