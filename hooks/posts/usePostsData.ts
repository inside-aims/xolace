import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const supabase = getSupabaseBrowserClient();

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
         *,
         posttags (
            tags (
              name
            )
          ),
            votes(
            user_id,
            vote_type
            ),
            comments:comments(count),
            views:views(count),
          collections(
            user_id
          )  
      `,
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 60 * 60, // 1 hour
    
  });
}
