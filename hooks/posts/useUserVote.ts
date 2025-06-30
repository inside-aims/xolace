import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const supabase = getSupabaseBrowserClient();

export function useUserVote(postId: string, userId: string) {
  return useQuery({
    queryKey: ['userVote', postId, userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      return data?.vote_type || null;
    },
    staleTime: Infinity, // Never stale
  });
}
