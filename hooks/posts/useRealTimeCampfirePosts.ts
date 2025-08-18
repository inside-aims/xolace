import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export function useRealTimeCampfirePosts(campfireId: string) {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!campfireId) return;

    const channel = supabase
      .channel(`campfire-posts-${campfireId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `campfire_id=eq.${campfireId}`,
        },
        (payload) => {
          // Invalidate and refetch the campfire posts query
          queryClient.invalidateQueries({
            queryKey: ['campfire-posts', campfireId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campfireId, queryClient, supabase]);
}
