// hooks/useNotificationCount.ts

import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

/**
 * Fetches the count of unread notifications for a specific user.
 * The query will only run if a userId is provided.
 *
 * @param userId The ID of the user whose notification count is to be fetched.
 * @returns The count of unread notifications.
 */
export function useNotificationCount(userId?: string) {
  const supabase = getSupabaseBrowserClient();

  const { data: count } = useQuery({
    // The query key includes the userId to ensure data is fetched and cached per user.
    queryKey: ['notifications', 'unread-count', userId],

    queryFn: async () => {
      // If there's no user, we shouldn't attempt to fetch.
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .eq('recipient_user_id', userId); // <-- The crucial correction

      if (error) {
        console.error("Error fetching notification count:", error);
        return 0;
      }

      return count ?? 0;
    },

    // This query should only run if the userId is available.
    enabled: !!userId,
    
    staleTime: 300000, // 5 minutes
  });

  return { count };
}