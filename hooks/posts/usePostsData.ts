import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { Post } from '@/types/global';

const supabase = getSupabaseBrowserClient();

export function usePosts(initialData: Post[]) {
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
    initialData,
    staleTime: 0,
  });
}