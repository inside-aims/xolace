// get user camfire count with react query

import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const QUERY_STALE_TIME = 60 * 60 * 1000; // 1 hour

export const useUserCampfireCount = (userId?: string) => {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['campfires', 'user', userId, 'count'],
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('campfire_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user campfire count:', error);
        throw new Error(error.message);
      }

      return count || 0;
    },
    staleTime: QUERY_STALE_TIME,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};
