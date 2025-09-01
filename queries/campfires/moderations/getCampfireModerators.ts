// hooks/campfires/moderations/useCampfireModerators.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export interface CampfireModerator {
  id: string;
  username: string;
  avatar_url: string;
  role: 'creator' | 'firekeeper';
  joined_at: string;
  permission_summary: string;
  permission_count: number;
  can_edit: boolean;
  permissions?: {
    id: number;
    key: string;
    display_name: string;
    permission_group: string;
  }[];
}

export function getCampfireModerators(campfireId: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['campfire-moderators', campfireId],
    queryFn: async (): Promise<CampfireModerator[]> => {
      const { data, error } = await supabase.rpc('get_campfire_moderators', {
        p_campfire_id: campfireId
      });

      if (error) {
        throw new Error(`Failed to fetch moderators: ${error.message}`);
      }

      return data as unknown as CampfireModerator[] || [];
    },
    enabled: !!campfireId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}