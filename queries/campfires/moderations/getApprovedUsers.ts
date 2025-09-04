// hooks/campfires/moderations/useApprovedUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export interface ApprovedUser {
  id: string;
  username: string;
  avatar_url: string;
  joined_at: string;
  reputation: number;
}

export const getApprovedUsers = (campfireId: string) => {
    const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['campfire-approved-users', campfireId],
    queryFn: async (): Promise<ApprovedUser[]> => {
      const { data, error } = await supabase.rpc('get_campfire_approved_users', {
        p_campfire_id: campfireId
      });

      if (error) {
        throw new Error(`Failed to fetch approved users: ${error.message}`);
      }

      return data as unknown as ApprovedUser[] || [];
    },
    enabled: !!campfireId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};