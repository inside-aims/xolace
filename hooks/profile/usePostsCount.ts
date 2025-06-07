import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const supabase = getSupabaseBrowserClient();

export function usePostsCount(userId: string) {
  return useQuery({
    queryKey: ['postsCount', userId],
    queryFn: async () => {
        const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      if (error) throw error;
      return count;
    },
    staleTime: 20 * 5,
    refetchOnWindowFocus: false,
  });
}
